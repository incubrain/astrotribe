// src/app.ts
import {
  QueueService,
  CustomLogger,
  MetricsService,
  CircuitBreakerService,
  ScraperService,
  WorkflowService,
  EventService,
  SchedulerService,
  PrismaService,
} from '@core'
import { ShutdownService } from './core/shutdown.service'
import { JobVersionService } from './jobs/utils/job-version.service'
import { JobRegistry } from './jobs/job.registry'
import { JobEvents } from './jobs/job.events'
import { ApplicationConfig } from './config'
import type { JobServices } from '@types'

export class Application {
  private readonly services: JobServices
  private readonly shutdownService: ShutdownService
  private readonly jobRegistry: JobRegistry
  private readonly jobEvents: JobEvents
  private readonly workflowService: WorkflowService
  private readonly schedulerService: SchedulerService

  constructor(config: ApplicationConfig) {
    // Initialize base services first
    const logger = new CustomLogger()
    logger.setDomain('jobs')

    const prisma = new PrismaService(logger)
    const event = new EventService(logger)
    const metricsService = new MetricsService(logger, prisma, event)
    const versionService = new JobVersionService(logger, prisma)

    // Initialize queue service
    const queue = new QueueService(config.database.url, logger, metricsService)

    // Initialize other services
    const scraper = new ScraperService(logger)

    // Create services object
    this.services = {
      logger,
      prisma,
      event,
      queue,
      scraper,
      metrics: metricsService,
      version: versionService,
    }

    // Initialize components that depend on services
    this.jobEvents = new JobEvents(event, logger)
    this.jobRegistry = new JobRegistry(this.services, logger)

    this.workflowService = new WorkflowService(queue, logger)
    this.schedulerService = new SchedulerService(queue, logger)

    // Initialize shutdown service last
    this.shutdownService = new ShutdownService(logger, queue, metricsService, scraper, prisma)
  }

  async start() {
    const { logger, prisma, queue, scraper } = this.services

    try {
      // Initialize database connection
      await prisma.connect()

      // Start core services
      await queue.start()
      await scraper.init()

      // Initialize jobs
      await this.jobRegistry.initialize()

      // Initialize schedules
      await this.schedulerService.initializeSchedules()

      logger.info('Application started successfully')
    } catch (error: any) {
      logger.error('Failed to start application', error)
      throw error
    }
  }

  async stop() {
    const { logger, prisma, queue, scraper } = this.services

    try {
      logger.info('Stopping application...')

      await queue.stop()
      await scraper.cleanup()
      await prisma.disconnect()

      logger.info('Application stopped successfully')
    } catch (error: any) {
      logger.error('Error stopping application', error)
      throw error
    }
  }
}
