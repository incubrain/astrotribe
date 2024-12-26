// src/jobs/job.registry.ts
import { JobServices } from '@types'
import { CustomLogger } from '../core/services/logger.service'
import { QueueService } from '../core/services/queue.service'
import { jobConfigs, type JobConfig } from './job.config'
import type { BaseJob } from './job.base'

export class JobRegistry {
  private jobs = new Map<string, BaseJob>()
  private configs = new Map<string, JobConfig>()

  constructor(
    private readonly services: JobServices,
    private readonly logger: CustomLogger,
  ) {
    this.logger.info('Initializing JobRegistry')
    // Load configurations
    for (const config of jobConfigs) {
      this.logger.debug(`Loading job config: ${config.name}`, {
        schedule: config.schedule,
        priority: config.priority,
        timeout: config.timeout,
      })
      this.configs.set(config.name, config)
    }
    this.logger.info('JobRegistry initialized', {
      configuredJobs: jobConfigs.map((c) => c.name),
    })
  }

  async initialize(): Promise<void> {
    this.logger.info('Starting job initialization')
    for (const config of this.configs.values()) {
      this.logger.debug(`Initializing job: ${config.name}`, {
        jobClass: config.Class.name,
        schedule: config.schedule,
        timeout: config.timeout,
      })
      await this.registerJob(config)
    }
    this.logger.info('Job initialization completed', {
      registeredJobs: Array.from(this.jobs.keys()),
    })
  }

  private async registerJob(config: JobConfig): Promise<void> {
    try {
      this.logger.debug(`Creating instance of job: ${config.name}`)
      // Instantiate the job class with required services
      const job = new config.Class(this.services)

      this.logger.debug(`Registering job with queue service: ${config.name}`)
      // Register the job with the queue service
      await job.register()

      this.logger.debug(`Storing job instance: ${config.name}`)
      // Store the job instance
      this.jobs.set(config.name, job)

      this.logger.info(`Successfully registered job: ${config.name}`, {
        version: job.version,
        schedule: job.schedule,
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      this.logger.error(`Failed to register job: ${config.name}`, {
        error,
        context: {
          name: config.name,
          schedule: config.schedule,
          timeout: config.timeout,
          priority: config.priority,
          timestamp: new Date().toISOString(),
        },
      })
      throw error
    }
  }

  getJob(name: string): BaseJob | undefined {
    const job = this.jobs.get(name)
    if (!job) {
      this.logger.warn(`Job not found: ${name}`, {
        availableJobs: Array.from(this.jobs.keys()),
      })
    }
    return job
  }

  getJobConfig(name: string): JobConfig | undefined {
    const config = this.configs.get(name)
    if (!config) {
      this.logger.warn(`Job config not found: ${name}`, {
        availableConfigs: Array.from(this.configs.keys()),
      })
    }
    return config
  }

  getAllJobs(): BaseJob[] {
    return Array.from(this.jobs.values())
  }

  getAllConfigs(): JobConfig[] {
    return Array.from(this.configs.values())
  }
}
