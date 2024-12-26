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
import { JobVersionService } from './jobs/job.versioning'
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
    // Initialize shutdown service last
    this.shutdownService = new ShutdownService(this.services)

    this.jobRegistry = new JobRegistry(this.services)
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

      await this.jobRegistry.initialize()

      this.services.logger.info('Application started successfully', {
        timestamp: new Date().toISOString(),
      })

      if (jobName) {
        console.log('Testing job:', jobName, this.jobRegistry)
        await this.jobRegistry.testJob(jobName)
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
}
