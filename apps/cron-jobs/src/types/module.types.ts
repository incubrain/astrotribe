import { JobConfig, JobServices } from './job.types'

export interface JobModule<TInput = any, TProcessed = any, TOutput = any> {
  name: string
  createJob: (services: JobServices) => JobConfig<TInput, TProcessed, TOutput>
}
