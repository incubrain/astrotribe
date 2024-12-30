// redis.module.ts
import { Module, Global, OnApplicationShutdown, Inject } from '@nestjs/common'
import { ConfigService, ConfigModule } from '@nestjs/config'
import { Redis } from 'ioredis'
import IORedis from 'ioredis'

@Global()
@Module({
  imports: [ConfigModule],
  providers: [
    // 2) Redis client for cache/metrics
    {
      provide: 'REDIS_CACHE',
      useFactory: (config: ConfigService) => {
        return new IORedis({
          host: config.get<string>('app.redis.host') || 'redis.railway.internal',
          port: config.get<number>('app.redis.port') || 6379,
          password: config.get<string>('app.redis.password'),
          username: config.get<string>('app.redis.username'),
          family: 0,
        })
      },
      inject: [ConfigService],
    },
  ],
  exports: ['REDIS_CACHE'],
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject('REDIS_CACHE') private cacheClient: Redis) {}

  async onApplicationShutdown() {
    // Alternative place to close connections if desired
    await Promise.all([this.cacheClient.quit()])
  }
}
