// src/types/queue.types.ts
export interface QueueOptions {
  priority?: number
  retryLimit?: number
  timeout?: number
  startAfter?: string | Date
  singletonKey?: string
  expireInSeconds?: number
}

export interface QueueJob<T = any> {
  id: string
  name: string
  data: T
  priority: number
  startedAt?: Date
  completedAt?: Date
  createdAt: Date
  state: 'created' | 'active' | 'completed' | 'failed' | 'expired'
}

export interface WorkflowJobData {
  progress: number
  jobs: string[]
  [key: string]: any
}

export interface WorkflowJob extends QueueJob<WorkflowJobData> {}
