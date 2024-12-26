// src/jobs/job.registry.ts
import { JobServices, QueueJob, JobClass, JobConfig } from '@types'
import { CustomLogger } from '../core/services/logger.service'
import { QueueService } from '../core/services/queue.service'
import { createNewsLinksJob } from './config/news/news-links.config'
import { JobRunner } from './job.runner'
import { BaseJob } from './job.base'

// src/jobs/job.registry.ts
export class JobRegistry {
  private jobRunner: JobRunner
  private jobs = new Map<string, JobConfig<any, any, any>>()

  constructor(private services: JobServices) {
    this.jobRunner = new JobRunner(services)

    const newsLinksJob = createNewsLinksJob(services)
    this.jobs.set(newsLinksJob.name, newsLinksJob)
  }

  async registerJob<TInput, TProcessed, TOutput>(
    JobClass: new (services: JobServices) => BaseJob<TInput, TProcessed, TOutput>,
  ) {
    const job = new JobClass(this.services)
    const config = job.createJobConfig()
    await this.jobRunner.registerJob(config)
    this.jobs.set(config.name, config as any)
  }

  getJob(name: string): JobConfig<any, any, any> | undefined {
    return this.jobs.get(name)
  }

  getJobs(): JobConfig<any, any, any>[] {
    return Array.from(this.jobs.values())
  }
}
