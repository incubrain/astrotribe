import type { ErrorSeverity } from '@astronera/db'
import type { CacheOptions } from './manager.types'

export interface LogEntry {
  service: string
  level: ErrorSeverity
  message: string
  metadata?: Record<string, any>
  timestamp: number
  context?: Record<string, any>
}

export interface QueueOptions extends CacheOptions {
  processingTimeout?: number // seconds
  maxRetries?: number
  retryDelay?: number // seconds
}

export interface QueueItem<T = any> {
  id: string
  data: T
  timestamp: number
  retries?: number
  status: 'pending' | 'processing' | 'failed' | 'completed'
}
