// src/clients/redis.client.ts
import Redis from 'ioredis'
import type { RedisConfig, RedisClientEvents } from '../types'

export class RedisClient {
  private static instance: RedisClient | null = null
  private client: Redis | null = null
  private isConnected: boolean = false
  private events: Partial<RedisClientEvents> = {}

  private constructor(private config: RedisConfig = {}) {
    this.initializeClient()
  }

  public static getInstance(config?: RedisConfig): RedisClient {
    if (!RedisClient.instance) {
      RedisClient.instance = new RedisClient(config)
    }
    return RedisClient.instance
  }

  private initializeClient(): void {
    const defaultConfig: RedisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      autoResubscribe: true,
      autoResendUnfulfilledCommands: true,
      retryStrategy: (times) => {
        const delay = Math.min(times * 50, 2000)
        return delay
      },
    }

    const finalConfig = { ...defaultConfig, ...this.config }

    try {
      this.client = new Redis(finalConfig)
      this.setupEventListeners()
    } catch (error: any) {
      console.error('Failed to initialize Redis client:', error)
      throw error
    }
  }

  private setupEventListeners(): void {
    if (!this.client) return

    this.client.on('connect', () => {
      this.isConnected = true
      this.events.connect?.()
    })

    this.client.on('ready', () => {
      this.events.ready?.()
    })

    this.client.on('error', (error) => {
      console.error('Redis client error:', error)
      this.events.error?.(error)
    })

    this.client.on('close', () => {
      this.isConnected = false
      this.events.close?.()
    })

    this.client.on('reconnecting', (params: { delay: number; attempt: number }) => {
      this.events.reconnecting?.(params)
    })
  }

  public on<T extends keyof RedisClientEvents>(event: T, listener: RedisClientEvents[T]): void {
    this.events[event] = listener
  }

  public getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client not initialized')
    }
    return this.client
  }

  public async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.quit()
      this.client = null
      this.isConnected = false
    }
  }

  public isClientConnected(): boolean {
    return this.isConnected
  }
}
