import { ErrorType, JobStatus } from '@astronera/db'

// types/metrics.types.ts
export interface JobMetrics {
  duration: number
  success: boolean
  error?: Error
  itemsProcessed?: number
  memoryUsage?: {
    heapUsed: number
    heapTotal: number
    external: number
  }
  performance?: {
    itemsPerSecond: number
    avgProcessingTime: number
    batchSize: number
  }
}

export interface JobExecutionMetrics {
  jobName: string
  jobId: string
  status: JobStatus
  startTime: Date
  duration?: number
  itemsProcessed?: number
  performance?: {
    itemsPerSecond: number
    avgProcessingTime: number
    peakMemoryUsage: number
  }
  error?: {
    message: string
    stack?: string
    code?: string
    type: ErrorType
  }
  metadata?: Record<string, any>
}

export interface CircuitBreakerMetrics {
  status: 'open' | 'closed' | 'half-open'
  failureCount: number
  lastFailure: Date
  resetTimeout: number
}

export interface QueueMetrics {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}

export interface QueueStats {
  created: number
  completed: number
  failed: number
  retry: number
  active: number
}

export interface JobMetricsData {
  jobId: string
  jobName: string
  status: string
  duration?: number
  itemsProcessed: number
  metadata?: Record<string, any>
  performance?: {
    itemsPerSecond: number
    avgProcessingTime: number
    peakMemoryUsage: number
  }
}

export interface JobPerformanceMetrics {
  itemsPerSecond: number
  avgProcessingTime: number
  peakMemoryUsage: number
  batchSize?: number
}

export interface ErrorLogData {
  service_name: string
  error_type: string
  message: string
  stack?: string
  metadata?: Record<string, any>
}
