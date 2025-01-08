// src/index.ts
import { RedisClient } from './clients'
import { KeyManager } from './managers/key.manager'
import { QueueManager } from './managers/queue.manager'
import { LogQueue } from './queues/log.queue'
import type { RedisConfig } from './types'

export * from './clients'
export * from './managers'
export * from './queues'
export * from './utils'

export function createCache(config?: RedisConfig) {
  const client = RedisClient.getInstance(config)

  return {
    client,
    keyManager: new KeyManager(client),
    queueManager: new QueueManager(client),
    logQueue: new LogQueue(client),
  }
}

// Add convenient factory functions
export function createLogQueue(config?: RedisConfig) {
  const client = RedisClient.getInstance(config)
  return new LogQueue(client)
}

export function createKeyManager(config?: RedisConfig) {
  const client = RedisClient.getInstance(config)
  return new KeyManager(client)
}

export function createQueueManager(config?: RedisConfig) {
  const client = RedisClient.getInstance(config)
  return new QueueManager(client)
}

// Add type exports
export type {
  RedisConfig,
  CacheOptions,
  QueueOptions,
  QueueItem,
  LogEntry,
  RetryOptions,
} from './types'
