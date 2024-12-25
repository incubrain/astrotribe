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

      await this.services.versionService.createVersion(
        this.name,
        this.version,
        this.changes,
        this.getConfig(),
      )
    } catch (error) {
      this.services.logger.error('Failed to register job version', { error })
    }
  }

  async register() {
    try {
      await this.services.queue.processJob(this.name, async (job) => {
        return this.execute(job)
      })

      if (this.schedule) {
        await this.services.queue.scheduleJob(this.name, this.schedule, {})
      }

      this.services.logger.info(`Registered job: ${this.name}`)
    } catch (error) {
      this.services.logger.error(`Failed to register job: ${this.name}`, { error })
      throw error
    }
  }

  protected abstract getDomain(): DomainsForService<Service.JOBS>

  protected abstract process(data: TInput): Promise<TOutput>

  protected abstract getConfig(): Record<string, any>

  async execute(job: QueueJob<TInput>): Promise<TOutput> {
    const startTime = Date.now()

    this.services.event.emit('job.started', this.name, job.id)

    try {
      const result = await this.process(job.data)

      const duration = Date.now() - startTime
      this.services.logger.info(`Completed job in ${duration}ms`, {
        jobId: job.id,
        jobName: this.name,
        duration,
      })

      this.services.event.emit('job.completed', this.name, job.id, result)

      return result
    } catch (error: any) {
      this.services.event.emit('job.failed', this.name, job.id, error)
      throw error
    }
  }

  protected emitProgress(jobId: string, progress: number) {
    this.services.event.emit('job.progress', this.name, jobId, progress)
  }
}
