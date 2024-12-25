// cache.service.ts
import { Inject, Injectable } from '@nestjs/common'
import { Redis } from 'ioredis'
import { CustomLogger } from '@/core/logger/custom.logger'

@Injectable()
export class CacheService {
  constructor(
    @Inject('REDIS_CACHE') private readonly cacheClient: Redis,
    private logger: CustomLogger,
  ) {
    this.logger.setDomain('cache')
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.cacheClient.get(key)
    return data ? (JSON.parse(data) as T) : null
  }

  async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
    const json = JSON.stringify(value)
    if (ttlSeconds) {
      await this.cacheClient.set(key, json, 'EX', ttlSeconds)
    } else {
      await this.cacheClient.set(key, json)
    }
  }

  async del(key: string): Promise<void> {
    await this.cacheClient.del(key)
  }

  // Example: flush all keys for a specific prefix
  async flushPrefix(prefix: string): Promise<void> {
    const keys = await this.cacheClient.keys(`${prefix}*`)
    if (keys.length) await this.cacheClient.del(keys)
  }

  // Example: read all data for debugging
  async getAllKeys(prefix: string): Promise<Array<{ key: string; value: any }>> {
    const keys = await this.cacheClient.keys(`${prefix}*`)
    const pipeline = this.cacheClient.pipeline()
    keys.forEach((k) => pipeline.get(k))
    const results = await pipeline.exec()

    return keys.map((k, i) => ({
      key: k,
      value: JSON.parse(results[i][1] || 'null'),
    }))
  }
}
