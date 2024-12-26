// utils/job-factory.ts
import { DomainsForService, Service } from '@ib/logger'
import { JobName, JobConfig, JobHandlers } from '../../types'

// src/utils/job-factory.ts
export class JobFactory {
  static createJob<TInput, TProcessed, TOutput>(
    config: Partial<JobConfig<TInput, TProcessed, TOutput>> & {
      name: string
      domain: DomainsForService<Service.JOBS>
      version: string
      changes: string[]
      handlers: JobHandlers<TInput, TProcessed, TOutput>
    },
  ): JobConfig<TInput, TProcessed, TOutput> {
    return {
      // Default configuration
      priority: 'normal',
      batchSize: 50,
      processSize: 10,
      timeout: 30000,
      retryLimit: 3,
      schedule: {
        type: 'interval',
        customCron: '0 0 * * *',
        enabled: false,
      },
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 60000,
      },
      // Override with provided config
      ...config,
    }
  }
}
