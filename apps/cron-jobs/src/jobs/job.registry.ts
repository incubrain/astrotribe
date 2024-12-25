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
    // Load configurations
    for (const config of jobConfigs) {
      this.configs.set(config.name, config)
    }
  }

  async initialize(): Promise<void> {
    for (const config of this.configs.values()) {
      await this.registerJob(config)
    }
  }

  private async registerJob(config: JobConfig): Promise<void> {
    try {
      // Instantiate the job class with required services
      const job = new config.Class(this.services)

      // Register the job with the queue service
      await job.register()

      // Store the job instance
      this.jobs.set(config.name, job)

      this.logger.info(`Registered job: ${config.name}`)
    } catch (error: any) {
      this.logger.error(`Failed to register job: ${config.name}`, error)
      throw error
    }
  }

  getJob(name: string): BaseJob | undefined {
    return this.jobs.get(name)
  }

  getJobConfig(name: string): JobConfig | undefined {
    return this.configs.get(name)
  }

  getAllJobs(): BaseJob[] {
    return Array.from(this.jobs.values())
  }

  getAllConfigs(): JobConfig[] {
    return Array.from(this.configs.values())
  }
}
