// src/app.ts
import {
  QueueService,
  CustomLogger,
  MetricsService,
  ScraperService,
  EventService,
  PrismaService,
} from '@core'
import { ShutdownService } from './core/shutdown.service'
import { JobVersionService } from './jobs/utils/job-version.service'
import { JobRegistry } from './jobs/job.registry'
import { ApplicationConfig } from './config'
import type { JobServices } from '@types'

export class Application {
  private readonly services: JobServices
  private readonly jobRegistry: JobRegistry
  private readonly shutdownService: ShutdownService

  constructor(config: ApplicationConfig) {
    // Initialize base services first
    const logger = new CustomLogger()
    logger.init()
    logger.setDomain('jobs')

    const prisma = new PrismaService(logger)
    const event = new EventService(logger)
    const metricsService = new MetricsService(logger, prisma, event)

    // Initialize queue service if needed
    const queue = new QueueService(config.database.url, logger, metricsService)

    // Create services object
    this.services = {
      logger,
      prisma,
      event,
      queue,
      metrics: metricsService,
      scraper: new ScraperService(logger),
      version: new JobVersionService(logger, prisma),
    }

    this.jobRegistry = new JobRegistry(this.services)

    // Initialize shutdown service last
    this.shutdownService = new ShutdownService(this.services)
  }

  async start(jobName?: string) {
    try {
      this.services.logger.info('Starting application initialization')

      // Initialize database connection
      this.services.logger.info('Connecting to database')
      await this.services.prisma.connect()

      // Start core services
      if (this.services.queue) {
        this.services.logger.info('Starting queue service')
        await this.services.queue.start()
      }

      // Initialize other services as needed
      // await this.initializeServices()

      this.services.logger.info('Application started successfully', {
        timestamp: new Date().toISOString(),
      })

      if (jobName) {
        await this.testJob(jobName)
      }
    } catch (error: any) {
      this.services.logger.error('Failed to start application', {
        ...error,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  async stop() {
    try {
      this.services.logger.info('Stopping application...', {
        timestamp: new Date().toISOString(),
      })

      if (this.services.queue) {
        await this.services.queue.stop()
      }
      await this.services.prisma.disconnect()

      this.services.logger.info('Application stopped successfully', {
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      this.services.logger.error('Error stopping application', {
        ...error,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  async testJob(jobName: string) {
    try {
      this.services.logger.info(`Looking up job: ${jobName}`)
      const job = this.jobRegistry.getJob(jobName)
      if (!job) {
        this.services.logger.warn(`Job ${jobName} not found`)
        throw new Error(`Job ${jobName} not found`)
      }

      this.services.logger.info(`Testing job: ${jobName}`, {
        jobVersion: job.version,
        jobSchedule: job.schedule,
      })

      // Get initial data from beforeProcess if it exists
      let jobData = {}
      try {
        this.services.logger.info(`Getting initial data for job ${jobName}`)
        jobData = await job.handlers.beforeProcess()
      } catch (error: any) {
        this.services.logger.error(`Failed to get initial data for job ${jobName}`, {
          error,
        })
        throw error
      }

      const jobId = await this.services.queue.testJob(jobName, jobData)
      this.services.logger.info(`Test job queued with ID: ${jobId}`, {
        jobName,
        jobId,
        timestamp: new Date().toISOString(),
      })
      return jobId
    } catch (error: any) {
      this.services.logger.error(`Failed to test job ${jobName}`, {
        ...error,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }
}
