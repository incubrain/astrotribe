// src/managers/key.manager.ts
import type { CacheOptions } from '../types'
import { BaseCacheManager } from './base.manager'

export interface KeyManagerOptions extends CacheOptions {
  compression?: boolean
}

export class KeyManager extends BaseCacheManager {
  constructor(client: any, options: KeyManagerOptions = {}) {
    super(client, { prefix: 'cache', ...options })
  }

  public async get<T>(key: string): Promise<T | null> {
    const fullKey = this.buildKey(key)
    const value = await this.redis.get(fullKey)

    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  public async set(key: string, value: any, options: CacheOptions = {}): Promise<void> {
    const fullKey = this.buildKey(key)
    const ttl = this.parseTTL(options.ttl || this.defaultTTL)
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)

    if (ttl) {
      await this.redis.setex(fullKey, ttl, serializedValue)
    } else {
      await this.redis.set(fullKey, serializedValue)
    }
  }

  public async delete(key: string): Promise<void> {
    const fullKey = this.buildKey(key)
    await this.redis.del(fullKey)
  }

  public async increment(key: string, by: number = 1): Promise<number> {
    const fullKey = this.buildKey(key)
    return this.redis.incrby(fullKey, by)
  }

  public async decrement(key: string, by: number = 1): Promise<number> {
    const fullKey = this.buildKey(key)
    return this.redis.decrby(fullKey, by)
  }

  public async exists(key: string): Promise<boolean> {
    const fullKey = this.buildKey(key)
    const result = await this.redis.exists(fullKey)
    return result === 1
  }

  public async setIfNotExists(
    key: string,
    value: any,
    options: CacheOptions = {},
  ): Promise<boolean> {
    const fullKey = this.buildKey(key)
    const ttl = this.parseTTL(options.ttl || this.defaultTTL)
    const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)

    const execResult = await this.redis
      .multi()
      .set(fullKey, serializedValue)
      .expire(fullKey, ttl)
      .exec()

    if (!execResult) {
      throw new Error('Failed to execute Redis multi command')
    }

    const [error, result] = execResult

    if (error) {
      throw error
    }

    return String(result) === 'OK'
  }

  public async getMultiple<T>(keys: string[]): Promise<(T | null)[]> {
    const fullKeys = keys.map((key) => this.buildKey(key))
    const values = await this.redis.mget(fullKeys)

    return values.map((value) => {
      if (!value) return null
      try {
        return JSON.parse(value)
      } catch {
        return value as T
      }
    })
  }

  public async setMultiple(
    entries: { key: string; value: any }[],
    options: CacheOptions = {},
  ): Promise<void> {
    const ttl = this.parseTTL(options.ttl || this.defaultTTL)
    const pipeline = this.redis.pipeline()

    for (const { key, value } of entries) {
      const fullKey = this.buildKey(key)
      const serializedValue = typeof value === 'string' ? value : JSON.stringify(value)

      if (ttl) {
        pipeline.setex(fullKey, ttl, serializedValue)
      } else {
        pipeline.set(fullKey, serializedValue)
      }
    }

    await pipeline.exec()
  }

  public async getTTL(key: string): Promise<number> {
    const fullKey = this.buildKey(key)
    return this.redis.ttl(fullKey)
  }

  public async setTTL(key: string, ttl: number | string): Promise<boolean> {
    const fullKey = this.buildKey(key)
    const seconds = this.parseTTL(ttl)
    const result = await this.redis.expire(fullKey, seconds)
    return result === 1
  }
}
