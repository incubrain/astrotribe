// src/jobs/job-base.ts
import { DomainsForService, Service } from '@ib/logger'
import { QueueService, ScraperService, CustomLogger, EventService } from '@core'
import { JobVersionService } from './utils/job-version.service'
import type { QueueJob, JobServices } from '@types'

// Update BaseJob to use events
export abstract class BaseJob<TInput = any, TOutput = any> {
  abstract readonly name: string
  abstract readonly version: string
  abstract readonly changes: string[]
  abstract readonly schedule?: string

  constructor(protected readonly services: JobServices) {
    this.services.logger.setDomain(this.getDomain())
    void this.registerVersion()
  }

  private async registerVersion() {
    try {
      if (!this.version || !this.changes) {
        this.services.logger.warn(`Job ${this.name} is missing version or changes`)
        return
      }

      const config = this.getConfig()
      this.services.logger.debug(`Registering version for job: ${this.name}`, {
        version: this.version,
        changes: this.changes,
        config,
      })

      await this.services.version.createVersion(this.name, this.version, this.changes, config)

      this.services.logger.info(`Version registered for job: ${this.name}`, {
        version: this.version,
      })
    } catch (error: any) {
      this.services.logger.error('Failed to register job version', {
        ...error,
      })
    }
  }

  async register() {
    const { logger } = this.services
    try {
      logger.info(`Starting registration for job: ${this.name}`)

      logger.debug(`Setting up job handler for: ${this.name}`)
      await this.services.queue.processJob(this.name, async (job: any) => {
        logger.info(`Executing job: ${this.name}`, {
          jobId: job.id,
          startTime: new Date().toISOString(),
        })

        try {
          const result = await this.execute(job)
          logger.info(`Job execution completed: ${this.name}`, {
            jobId: job.id,
            endTime: new Date().toISOString(),
          })
          return result
        } catch (error: any) {
          logger.error(`Job execution failed: ${this.name}`, {
            error,
          })
          throw error
        }
      })

      if (this.schedule) {
        logger.debug(`Setting up job schedule for: ${this.name}`, {
          schedule: this.schedule,
        })
        await this.services.queue.scheduleJob(this.name, this.schedule, {})
      }

      logger.info(`Registration completed for job: ${this.name}`, {
        version: this.version,
        schedule: this.schedule,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      logger.error(`Failed to register job: ${this.name}`, {
        error,
      })
      throw error
    }
  }

  protected abstract getDomain(): DomainsForService<Service.JOBS>

  protected abstract getConfig(): any

  protected abstract process(data: any[]): Promise<any[]>

  protected abstract beforeProcess(data: any): Promise<any[]>

  protected abstract afterProcess(data: any[]): Promise<any[]>

  private async execute(job: QueueJob): Promise<TOutput> {
    const { logger } = this.services
    const startTime = Date.now()

    try {
      logger.info(`Starting job execution: ${this.name}`, {
        jobId: job.id,
        startTime: new Date().toISOString(),
      })

      // Get initial data if beforeProcess exists
      let data = job.data
      const beforeProcess = await this.beforeProcess(data)

      // Process the job
      logger.debug(`Running process for job: ${this.name}`)
      const result = await this.process(beforeProcess)
      logger.debug(`Process completed for job: ${this.name}`)

      // Run afterProcess if it exists
      const afterProcess = await this.afterProcess(result)

      const duration = Date.now() - startTime
      logger.info(`Job execution completed: ${this.name}`, {
        jobId: job.id,
        duration,
        endTime: new Date().toISOString(),
      })

      return result
    } catch (error: any) {
      const duration = Date.now() - startTime
      logger.error(`Job execution failed: ${this.name}`, {
        error,
      })

      // Run error handler if it exists
      if (typeof this['onError'] === 'function') {
        try {
          logger.debug(`Running error handler for job: ${this.name}`)
          await this['onError'](error)
          logger.debug(`Error handler completed for job: ${this.name}`)
        } catch (handlerError: any) {
          logger.error(`Error handler failed for job: ${this.name}`, {
            error: handlerError,
          })
        }
      }

      throw error
    }
  }
}
