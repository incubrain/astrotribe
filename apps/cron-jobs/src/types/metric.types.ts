import { error_type, job_status } from '@astronera/db'

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
  status: job_status
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
    type: error_type
  }
  metadata?: Record<string, any>
}

export interface CircuitBreakerMetrics {
  jobName: string
  state: 'closed' | 'open' | 'half-open'
  failures: number
  lastFailure: Date
  lastSuccess?: Date
  recoveryAttempts: number
  timeInCurrentState: number
}

export interface QueueMetrics {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}
