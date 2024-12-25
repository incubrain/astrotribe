// types/metrics.types.ts
export interface JobMetrics {
  totalRuns: number
  successCount: number
  failureCount: number
  avgDuration: number
  lastRunTime?: Date
  lastStatus?: 'success' | 'failure'
  consecutiveFailures: number
  itemsProcessed: number
}

export interface QueueMetrics {
  waiting: number
  active: number
  completed: number
  failed: number
  delayed: number
}
