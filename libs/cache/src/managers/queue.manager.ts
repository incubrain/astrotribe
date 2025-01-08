// src/managers/queue-manager.ts
import type { QueueItem, QueueOptions } from '../types'
import { BaseCacheManager } from './base.manager'

export class QueueManager extends BaseCacheManager {
  private readonly processingTimeout: number
  private readonly maxRetries: number
  private readonly retryDelay: number

  constructor(client: any, options: QueueOptions = {}) {
    super(client, { prefix: 'queue', ...options })
    this.processingTimeout = options.processingTimeout || 300 // 5 minutes
    this.maxRetries = options.maxRetries || 3
    this.retryDelay = options.retryDelay || 60 // 1 minute
  }

  public async enqueue<T>(data: T): Promise<string> {
    const id = this.generateId()
    const timestamp = Date.now()

    const item: QueueItem<T> = {
      id,
      data,
      timestamp,
      retries: 0,
      status: 'pending',
    }

    const pipeline = this.redis.pipeline()

    // Add to the queue
    pipeline.zadd(this.buildKey('pending'), timestamp, id)

    // Store the item data
    pipeline.hset(this.buildKey(`item:${id}`), 'data', JSON.stringify(item))

    await pipeline.exec()
    return id
  }

  public async dequeue<T>(batchSize: number = 10): Promise<QueueItem<T>[]> {
    const now = Date.now()
    const pipeline = this.redis.pipeline()

    // Get items from pending queue
    const pendingIds = await this.redis.zrange(this.buildKey('pending'), 0, batchSize - 1)

    if (pendingIds.length === 0) {
      // Check for retry-ready failed items
      const retryIds = await this.redis.zrangebyscore(
        this.buildKey('failed'),
        0,
        now - this.retryDelay * 1000,
      )

      if (retryIds.length > 0) {
        for (const id of retryIds.slice(0, batchSize)) {
          const item = await this.getItem<T>(id)
          if (item && item.retries && item.retries < this.maxRetries) {
            pendingIds.push(id)
          }
        }
      }
    }

    if (pendingIds.length === 0) return []

    // Move items to processing queue
    for (const id of pendingIds) {
      pipeline.zrem(this.buildKey('pending'), id)
      pipeline.zrem(this.buildKey('failed'), id)
      pipeline.zadd(this.buildKey('processing'), now, id)

      // Update status
      const item = await this.getItem<T>(id)
      if (item) {
        item.status = 'processing'
        pipeline.hset(this.buildKey(`item:${id}`), 'data', JSON.stringify(item))
      }
    }

    await pipeline.exec()

    // Get all items
    const items: QueueItem<T>[] = []
    for (const id of pendingIds) {
      const item = await this.getItem<T>(id)
      if (item) items.push(item)
    }

    return items
  }

  public async complete(id: string): Promise<void> {
    const pipeline = this.redis.pipeline()

    // Remove from processing queue
    pipeline.zrem(this.buildKey('processing'), id)

    // Update status
    const item = await this.getItem(id)
    if (item) {
      item.status = 'completed'
      pipeline.hset(this.buildKey(`item:${id}`), 'data', JSON.stringify(item))
    }

    // Store in completed set with TTL
    pipeline.zadd(this.buildKey('completed'), Date.now(), id)
    pipeline.expire(this.buildKey(`item:${id}`), this.defaultTTL)

    await pipeline.exec()
  }

  public async fail(id: string, error?: Error): Promise<void> {
    const pipeline = this.redis.pipeline()
    const item = await this.getItem(id)

    if (item) {
      item.status = 'failed'
      item.retries = (item.retries || 0) + 1

      // Remove from processing
      pipeline.zrem(this.buildKey('processing'), id)

      // Add to failed queue
      pipeline.zadd(this.buildKey('failed'), Date.now(), id)

      // Update item data
      pipeline.hset(this.buildKey(`item:${id}`), 'data', JSON.stringify(item))

      if (error) {
        pipeline.hset(
          this.buildKey(`item:${id}`),
          'error',
          JSON.stringify({
            message: error.message,
            stack: error.stack,
          }),
        )
      }

      await pipeline.exec()
    }
  }

  protected async getItem<T>(id: string): Promise<QueueItem<T> | null> {
    const data = await this.redis.hget(this.buildKey(`item:${id}`), 'data')
    if (!data) return null

    try {
      return JSON.parse(data) as QueueItem<T>
    } catch {
      return null
    }
  }

  public async getStatus(id: string): Promise<string | null> {
    const item = await this.getItem(id)
    return item?.status || null
  }

  public async cleanup(): Promise<void> {
    const now = Date.now()

    // Clean up stalled processing items
    const stalledIds = await this.redis.zrangebyscore(
      this.buildKey('processing'),
      0,
      now - this.processingTimeout * 1000,
    )

    for (const id of stalledIds) {
      await this.fail(id, new Error('Processing timeout exceeded'))
    }

    // Remove old completed items
    const completedIds = await this.redis.zrangebyscore(
      this.buildKey('completed'),
      0,
      now - this.defaultTTL * 1000,
    )

    if (completedIds.length > 0) {
      const pipeline = this.redis.pipeline()

      pipeline.zrem(this.buildKey('completed'), ...completedIds)
      for (const id of completedIds) {
        pipeline.del(this.buildKey(`item:${id}`))
      }

      await pipeline.exec()
    }
  }

  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`
  }

  // Implement required abstract methods
  public async get(key: string): Promise<any> {
    return this.getItem(key)
  }

  public async set(key: string, value: any): Promise<void> {
    await this.enqueue(value)
  }

  public async delete(key: string): Promise<void> {
    const pipeline = this.redis.pipeline()

    pipeline.zrem(this.buildKey('pending'), key)
    pipeline.zrem(this.buildKey('processing'), key)
    pipeline.zrem(this.buildKey('failed'), key)
    pipeline.zrem(this.buildKey('completed'), key)
    pipeline.del(this.buildKey(`item:${key}`))

    await pipeline.exec()
  }
}
