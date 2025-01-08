// src/queues/log.queue.ts
import { QueueManager } from '../managers/queue.manager'
import type { LogEntry, QueueOptions } from '../types'

export class LogQueue extends QueueManager {
  constructor(client: any, options: QueueOptions = {}) {
    super(client, {
      prefix: 'logs',
      processingTimeout: 60, // 1 minute
      maxRetries: 3,
      retryDelay: 30,
      ...options,
    })
  }

  public async pushLog(log: Omit<LogEntry, 'timestamp'>): Promise<string> {
    const logEntry: LogEntry = {
      ...log,
      timestamp: Date.now(),
    }
    return this.enqueue(logEntry)
  }

  public async processBatch(batchSize: number = 50): Promise<LogEntry[]> {
    const items = await this.dequeue<LogEntry>(batchSize)
    return items.map((item) => item.data)
  }

  public async getFailedLogs(): Promise<LogEntry[]> {
    const failedItems = await this.redis.zrange(this.buildKey('failed'), 0, -1)

    const logs: LogEntry[] = []
    for (const id of failedItems) {
      const item = await this.getItem<LogEntry>(id)
      if (item?.data) {
        logs.push(item.data)
      }
    }

    return logs
  }

  public async getStats(): Promise<{
    pending: number
    processing: number
    failed: number
    completed: number
  }> {
    const [pending, processing, failed, completed] = await Promise.all([
      this.redis.zcard(this.buildKey('pending')),
      this.redis.zcard(this.buildKey('processing')),
      this.redis.zcard(this.buildKey('failed')),
      this.redis.zcard(this.buildKey('completed')),
    ])

    return {
      pending,
      processing,
      failed,
      completed,
    }
  }

  public async getLogsByService(service: string): Promise<LogEntry[]> {
    // Get all pending and processing logs
    const allItems = await Promise.all([
      this.redis.zrange(this.buildKey('pending'), 0, -1),
      this.redis.zrange(this.buildKey('processing'), 0, -1),
    ])

    const logs: LogEntry[] = []
    const ids = [...allItems[0], ...allItems[1]]

    for (const id of ids) {
      const item = await this.getItem<LogEntry>(id)
      if (item?.data && item.data.service === service) {
        logs.push(item.data)
      }
    }

    return logs
  }

  public async clearFailedLogs(): Promise<number> {
    const failedItems = await this.redis.zrange(this.buildKey('failed'), 0, -1)

    if (failedItems.length === 0) return 0

    const pipeline = this.redis.pipeline()

    pipeline.zrem(this.buildKey('failed'), ...failedItems)
    for (const id of failedItems) {
      pipeline.del(this.buildKey(`item:${id}`))
    }

    await pipeline.exec()
    return failedItems.length
  }

  public async retryAllFailed(): Promise<number> {
    const failedItems = await this.redis.zrange(this.buildKey('failed'), 0, -1)

    if (failedItems.length === 0) return 0

    const pipeline = this.redis.pipeline()
    const now = Date.now()

    for (const id of failedItems) {
      pipeline.zrem(this.buildKey('failed'), id)
      pipeline.zadd(this.buildKey('pending'), now, id)
    }

    await pipeline.exec()
    return failedItems.length
  }
}
