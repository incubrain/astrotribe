import { JobServices } from '@types'
import { JobFactory } from '../../job.factory'

interface TestJobInput {
  id: number
  value: string
}

interface TestJobProcessed {
  id: number
  processedValue: string
  status: string
  processingTime: number
}

interface TestJobOutput {
  totalProcessed: number
  averageProcessingTime: number
  successRate: number
}

interface TestJobOptions {
  name: string
  scheduleEnabled?: boolean
  scheduleType?: 'cron' | 'interval'
  customCron?: string
}

export function createTestJob(services: JobServices, options: TestJobOptions) {
  const { logger } = services

  return JobFactory.createJob<TestJobInput, TestJobProcessed, TestJobOutput>({
    name: options.name,
    domain: 'test',
    version: '1.0.0',
    changes: ['Initial version'],
    schedule: {
      type: options.scheduleType || 'interval',
      customCron: options.customCron || '*/15 * * * *',
      enabled: options.scheduleEnabled ?? false,
    },
    handlers: {
      beforeProcess: async () => {
        logger.info(`[${options.name}] Preparing test data`)
        return [
          { id: 1, value: 'test1' },
          { id: 2, value: 'test2' },
          { id: 3, value: 'test3' },
        ]
      },
      processFunction: async (input: TestJobInput[], job: any) => {
        logger.info(`[${options.name}] Processing items`, { jobId: job.id })

        const startTime = Date.now()
        const processedItems = input.map((item) => ({
          id: item.id,
          processedValue: `processed_${item.value}`,
          status: 'success',
          processingTime: Date.now() - startTime,
        }))

        return processedItems
      },
      afterProcess: async (processed: TestJobProcessed[]) => {
        logger.info(`[${options.name}] Finalizing processing`, {
          count: processed.length,
        })

        const successfulItems = processed.filter((item) => item.status === 'success')
        const totalTime = processed.reduce((sum, item) => sum + item.processingTime, 0)

        return [
          {
            totalProcessed: processed.length,
            averageProcessingTime: totalTime / processed.length,
            successRate: (successfulItems.length / processed.length) * 100,
          },
        ]
      },
      onError: async (error) => {
        logger.error(`[${options.name}] Job failed`, { error })
      },
    },
  })
}

export const testModules = [
  {
    name: 'test_frequent',
    createJob: (services: JobServices) =>
      createTestJob(services, {
        name: 'test_frequent_job',
        scheduleEnabled: true,
        scheduleType: 'interval',
      }),
  },
  {
    name: 'test_daily',
    createJob: (services: JobServices) =>
      createTestJob(services, {
        name: 'test_daily_job',
        scheduleEnabled: true,
        scheduleType: 'cron',
        customCron: '0 0 * * *',
      }),
  },
  {
    name: 'test_weekly',
    createJob: (services: JobServices) =>
      createTestJob(services, {
        name: 'test_weekly_job',
        scheduleEnabled: true,
        scheduleType: 'cron',
        customCron: '0 0 * * 0',
      }),
  },
]

export const monitoringTestModule = {
  name: 'monitoring_test',
  createJob: (services: JobServices) =>
    createTestJob(services, {
      name: 'monitoring_test_job',
      scheduleEnabled: true,
      scheduleType: 'interval',
    }),
}
