import { BatchConfig } from './job.types'

export interface WorkflowOptions {
  name: string
  jobs: BatchConfig[]
  concurrency?: number
  onComplete?: (result: any) => Promise<void>
  onFail?: (error: Error) => Promise<void>
}

export interface WorkflowStatus {
  total: number
  completed: number
  failed: number
  pending: number
  active: number
}
