// src/jobs/job.registry.ts
import PgBoss from 'pg-boss'
import { JobServices, QueueJob, JobClass, JobConfig, JobModule } from '@types'
import { CustomLogger } from '../core/services/logger.service'
import { QueueService } from '../core/services/queue.service'
import { JobRunner } from './job.runner'
import { JobVersionService } from './job.versioning'
import { newsJobModules } from './config/news/news.module'

export class JobRegistry {
  private jobs = new Map<string, JobConfig<any, any, any>>()
  private versionService: JobVersionService
  private jobModules: JobModule[] = []

  constructor(private services: JobServices) {
    this.versionService = new JobVersionService(services.logger, services.prisma)
  }

  private registerJobModule(jobModule: JobModule) {
    if (this.jobModules.find((m) => m.name === jobModule.name)) {
      throw new Error(`Job module ${jobModule.name} already registered`)
    }
    this.jobModules.push(jobModule)
  }

  private registerModules(modules: JobModule[]) {
    for (const module of modules) {
      this.registerJobModule(module)
      this.services.logger.info(`Registered job module: ${module.name}`)
    }
  }

  private loadJobModules() {
    // Register core job modules
    this.registerModules(newsJobModules)

    // In the future, add other module groups here like:
    // this.registerModules(analyticsJobModules)
    // this.registerModules(maintenanceJobModules)
    // etc.
  }

  async initialize(
    options: { environment: 'development' | 'production' } = { environment: 'production' },
  ) {
    try {
      this.loadJobModules()

      this.services.logger.info('Loaded job modules', {
        modules: this.jobModules.map((m) => m.name),
      })

      if (!(await this.services.queue.isInstalled())) {
        this.services.logger.info('Installing queue schema...')
        await this.services.queue.start()
      }

      // Initialize all registered job modules
      for (const module of this.jobModules) {
        const jobConfig = module.createJob(this.services)
        await this.registerJob(jobConfig)
        this.services.logger.info(`Initialized job from module: ${module.name}`, {
          name: jobConfig.name,
          version: jobConfig.version,
          schedule: jobConfig.schedule,
        })
      }

      // Log the final state
      const registeredJobs = this.getJobs()
      this.services.logger.info('Job registry initialized successfully', {
        totalJobs: registeredJobs.length,
        jobs: registeredJobs.map((job) => ({
          name: job.name,
          version: job.version,
          schedule: job.schedule?.enabled ? job.schedule.customCron : 'disabled',
        })),
      })
    } catch (error: any) {
      this.services.logger.error('Failed to initialize job registry', { error })
      throw error
    }
  }

  async registerJob<TInput, TProcessed, TOutput>(config: JobConfig<TInput, TProcessed, TOutput>) {
    try {
      // Store job config
      const { logger } = this.services
      this.jobs.set(config.name, config)

      // Create version record
      await this.versionService.createVersion(config.name, config.version, config.changes, config)

      // Register job handler with queue
      await this.services.queue.processJob(config.name, async (job) => {
        try {
          // Execute job handlers in sequence
          logger.info(`Starting job: ${job.name}:${config.name}`)
          const input = (await config.handlers.beforeProcess?.()) || []
          logger.info(`Processing job: ${job.name}:${config.name}`)
          const processed = await config.handlers.processFunction(input, job)
          logger.info(`Storing job data: ${job.name}:${config.name}`)
          const output = (await config.handlers.afterProcess?.(processed)) || processed
          logger.info(`Job completed: ${job.name}:${config.name}`)

          return output
        } catch (error: any) {
          await config.handlers.onError?.(error as Error)
          throw error
        }
      })

      // Set up job schedule if configured
      if (config.schedule?.enabled) {
        await this.services.queue.scheduleJob(
          config.name,
          config.schedule.customCron,
          {},
          {
            timeout: config.timeout,
            retryLimit: config.retryLimit,
            priority: config.priority,
          },
        )
      }

      this.services.logger.info(`Registered job: ${config.name} v${config.version}`)
    } catch (error: any) {
      this.services.logger.error(`Failed to register job: ${config.name}`, { error })
      throw error
    }
  }

  getJob(name: string): JobConfig<any, any, any> | undefined {
    return this.jobs.get(name)
  }

  getJobs(): JobConfig<any, any, any>[] {
    return Array.from(this.jobs.values())
  }

  async testJob(name: string) {
    const job = this.getJob(name)

    if (!job) {
      throw new Error(`Job ${name} not found`)
    }

    try {
      const jobId = await this.services.queue.testJob(name)
      this.services.logger.info(`Test job created: ${name}`, { jobId })
      return jobId
    } catch (error: any) {
      this.services.logger.error(`Failed to test job: ${name}`, { error })
      throw error
    }
  }
}
