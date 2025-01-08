import type { JobServices, JobConfig, QueueJob } from '@types'

// src/jobs/job.runner.ts
export class JobRunner {
  constructor(private services: JobServices) {}

  async registerJob<TInput, TProcessed, TOutput>(config: JobConfig<TInput, TProcessed, TOutput>) {
    const { logger, queue } = this.services

    try {
      // Register job handler
      await queue.processJob(config.name, this.createJobHandler(config) as any)

      // Set up schedule if configured
      if (config.schedule?.enabled) {
        await this.scheduleJob(config)
      }

      logger.info(`Job registered: ${config.name}`)
    } catch (error: any) {
      logger.error(`Failed to register job: ${config.name}`, { error })
      throw error
    }
  }

  private createJobHandler<TInput, TProcessed, TOutput>(
    config: JobConfig<TInput, TProcessed, TOutput>,
  ) {
    return async (job: QueueJob) => {
      const startTime = Date.now()
      const jobId = job.id || crypto.randomUUID()

      await this.services.queue.trackJobMetrics(config.name, jobId, {
        status: 'active',
        started_at: new Date(),
      })

      try {
        const input = (await config.handlers.beforeProcess?.()) || []
        const processed = await config.handlers.processFunction(input, job)
        const output = (await config.handlers.afterProcess?.(processed)) || processed

        await this.services.queue.trackJobMetrics(config.name, jobId, {
          status: 'completed',
          duration_ms: Date.now() - startTime,
          items_processed: Array.isArray(processed) ? processed.length : undefined,
        })
        await config.handlers.onSuccess?.(output as TOutput)
        return output
      } catch (error: any) {
        await this.services.queue.trackJobMetrics(config.name, jobId, {
          status: 'failed',
          duration_ms: Date.now() - startTime,
          error_message: error.message,
          error_stack: error.stack,
        })

        await config.handlers.onError?.(error as Error)
        throw error
      }
    }
  }

  private async scheduleJob(config: JobConfig<any, any, any>) {
    await this.services.queue.scheduleJob(config.name, config.schedule?.customCron ?? '', {
      timeout: config.timeout,
      retryLimit: config.retryLimit,
      priority: config.priority,
    })
  }
}
