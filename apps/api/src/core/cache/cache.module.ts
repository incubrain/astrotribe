// redis.module.ts
import { Module, Global, OnApplicationShutdown, Inject } from '@nestjs/common'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { Redis } from 'ioredis'
import IORedis from 'ioredis'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // 1) Redis client for Bull (jobs queue)
    {
      provide: 'REDIS_BULL',
      useFactory: (config: ConfigService) => {
        return new IORedis({
          host: config.get<string>('app.redisBullHost') || 'redis.railway.internal',
          port: config.get<number>('app.redisBullPort') || 6379,
          password: config.get<string>('app.redisBullPassword'),
          username: config.get<string>('app.redisBullUser'),
          family: 0,
          retryStrategy: (times: number) => {
            const delay = Math.min(times * 50, 2000)
            return delay
          },
          maxRetriesPerRequest: null,
        })
      },
      inject: [ConfigService],
    },

    // 2) Redis client for cache/metrics
    {
      provide: 'REDIS_CACHE',
      useFactory: (config: ConfigService) => {
        return new IORedis({
          host: config.get<string>('app.redisCacheHost') || 'redis.railway.internal',
          port: config.get<number>('app.redisCachePort') || 6379,
          password: config.get<string>('app.redisCachePassword'),
          username: config.get<string>('app.redisBullUser'),
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_BULL', 'REDIS_CACHE'],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(
    @Inject('REDIS_BULL') private bullClient: Redis,
    @Inject('REDIS_CACHE') private cacheClient: Redis,
  ) {}

  async onApplicationShutdown() {
    // Alternative place to close connections if desired
    await Promise.all([this.bullClient.quit(), this.cacheClient.quit()])
  }
}
