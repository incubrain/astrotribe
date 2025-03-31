// src/managers/base.manager.ts
import ms from 'ms'
import type Redis from 'ioredis'
import type { CacheOptions } from '../types'
import type { RedisClient } from '../clients/redis.client'

export abstract class BaseCacheManager {
  protected redis: Redis
  protected prefix: string
  protected defaultTTL: number

  constructor(
    protected client: RedisClient,
    protected options: CacheOptions = {},
  ) {
    this.redis = client.getClient()
    this.prefix = options.prefix || ''
    this.defaultTTL = this.parseTTL(options.ttl || '1h')
  }

  protected parseTTL(ttl: number | string): number {
    if (typeof ttl === 'number') {
      return ttl
    }
    return Math.floor(ms(ttl) / 1000) // Convert ms to seconds
  }

  protected buildKey(key: string): string {
    return this.prefix ? `${this.prefix}:${key}` : key
  }

  protected async lock(key: string, ttl: number = 30): Promise<string | null> {
    const lockKey = `lock:${key}`
    const token = Math.random().toString(36).slice(2)

    const acquired = await this.redis.multi().set(lockKey, token).expire(lockKey, ttl).exec()

    return acquired ? token : null
  }

  protected async unlock(key: string, token: string): Promise<boolean> {
    const lockKey = `lock:${key}`
    const script = `
      if redis.call("get", KEYS[1]) == ARGV[1] then
        return redis.call("del", KEYS[1])
      else
        return 0
      end
    `

    const result = await this.redis.eval(script, 1, lockKey, token)

    return result === 1
  }

  public async clearPrefix(prefix: string): Promise<void> {
    const pattern = `${prefix}:*`
    const keys = await this.redis.keys(pattern)

    if (keys.length > 0) {
      await this.redis.del(...keys)
    }
  }

  public async healthCheck(): Promise<boolean> {
    try {
      await this.redis.ping()
      return true
    } catch (error: any) {
      return false
    }
  }

  public abstract get(key: string): Promise<any>
  public abstract set(key: string, value: any, options?: CacheOptions): Promise<void>
  public abstract delete(key: string): Promise<void>
}
