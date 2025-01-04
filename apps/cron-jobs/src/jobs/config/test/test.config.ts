import { JobConfig, JobServices } from '@types'
import { faker } from '@faker-js/faker'
// src/jobs/modules/test/types.ts
export interface TestJobInput {
  batchId: string
  items: number[]
}

export interface TestJobProcessed {
  processedItems: number[]
  processingTime: number
  status: 'success' | 'partial' | 'failed'
}

export interface TestJobOutput {
  totalProcessed: number
  averageProcessingTime: number
  successRate: number
}

export interface TestJobOptions {
  name: string
  scheduleEnabled?: boolean
  scheduleType?: 'interval' | 'daily' | 'weekly' | 'monthly' | 'custom'
  customCron?: string
  simulateErrors?: boolean
}

export const createTestJob = (
  services: JobServices,
  options: TestJobOptions,
): JobConfig<TestJobInput, TestJobProcessed, TestJobOutput> => {
  const { logger } = services

  return {
    name: options.name,
    domain: 'test',
    version: '1.0.0',
    changes: ['Initial test job implementation'],
    priority: 'normal',
    batchSize: 10,
    processSize: 2,
    timeout: 5000,
    retryLimit: 2,
    schedule: {
      type: options.scheduleType || 'interval',
      customCron: options.customCron || '*/15 * * * *',
      enabled: options.scheduleEnabled ?? false,
    },
    circuitBreaker: {
      enabled: true,
      failureThreshold: 5,
      resetTimeout: 60000,
    },
    handlers: {
      beforeProcess: async (): Promise<TestJobInput[]> => {
        logger.info(`[${options.name}] Preparing test data`)
        return [
          {
            batchId: faker.string.uuid(),
            items: Array.from({ length: 5 }, () => faker.number.int({ min: 1, max: 100 })),
          },
        ]
      },
      processFunction: async (input: any[], job: any) => {
        logger.info(`[${options.name}] Processing items`, { jobId: job.id })

        const startTime = Date.now()
        await new Promise((resolve) =>
          setTimeout(resolve, faker.number.int({ min: 100, max: 1000 })),
        )

        if (options.simulateErrors && faker.number.int({ min: 1, max: 10 }) === 1) {
          throw new Error('Simulated random processing error')
        }

        const processedItems = input.map((item) => {
          if (faker.number.int({ min: 1, max: 10 }) > 8) {
            return 0 // Simulate failed item
          }
          return item * 2
        })

        const status = processedItems.every((item) => item > 0)
          ? 'success'
          : processedItems.some((item) => item > 0)
            ? 'partial'
            : 'failed'

        return {
          processedItems,
          processingTime: Date.now() - startTime,
          status,
        }
      },
      afterProcess: async (processed) => {
        logger.info(`[${options.name}] Finalizing processing`, {
          status: processed.status,
          processingTime: processed.processingTime,
        })

        const successfulItems = processed.processedItems.filter((item) => item > 0)

        return {
          totalProcessed: processed.processedItems.length,
          averageProcessingTime: processed.processingTime / processed.processedItems.length,
          successRate: (successfulItems.length / processed.processedItems.length) * 100,
        }
      },
      onError: async (error) => {
        logger.error(`[${options.name}] Error during execution`, { error })
      },
    },
  }
}

export const testModules: JobModule[] = [
  {
    name: 'test_frequent',
    createJob: (services) =>
      createTestJob(services, {
        name: 'test_frequent_job',
        scheduleEnabled: true,
        scheduleType: 'interval',
        customCron: '*/5 * * * *',
        simulateErrors: true,
      }),
  },
  {
    name: 'test_daily',
    createJob: (services) =>
      createTestJob(services, {
        name: 'test_daily_job',
        scheduleEnabled: true,
        scheduleType: 'daily',
        customCron: '0 9 * * *',
      }),
  },
  {
    name: 'test_weekly',
    createJob: (services) =>
      createTestJob(services, {
        name: 'test_weekly_job',
        scheduleEnabled: true,
        scheduleType: 'weekly',
        customCron: '0 12 * * MON',
      }),
  },
]

export const monitoringTestModule: JobModule = {
  name: 'monitoring_test',
  createJob: (services) =>
    createTestJob(services, {
      name: 'monitoring_test_job',
      scheduleEnabled: true,
      scheduleType: 'interval',
      customCron: '*/30 * * * *',
      simulateErrors: false,
    }),
}
