// utils/job-factory.ts
import { DomainKey, JobName, JobConfig, JobHandlers } from '../../types'

export class JobFactory {
  static createJob<TInput, TProcessed, TOutput>(
    config: Partial<JobConfig<TInput, TProcessed, TOutput>> & {
      name: JobName
      domain: DomainKey
      handlers: JobHandlers<TInput, TProcessed, TOutput>
    },
  ): JobConfig<TInput, TProcessed, TOutput> {
    // Default configuration
    const defaultConfig: Partial<JobConfig> = {
      priority: 50,
      batchSize: 50,
      processSize: 10,
      maxItems: 1000,
      retryLimit: 3,
      timeout: 30000,
      schedule: {
        type: 'interval',
        interval: { value: 1, unit: 'hour' },
        enabled: false,
      },
      circuitBreaker: {
        enabled: true,
        failureThreshold: 5,
        resetTimeout: 60000,
        halfOpenRetries: 3,
      },
    }

    return {
      ...defaultConfig,
      ...config,
    } as JobConfig<TInput, TProcessed, TOutput>
  }
}
