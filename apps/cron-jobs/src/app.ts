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
    logger.init()
    logger.setDomain('jobs')

    const prisma = new PrismaService(logger)
    const event = new EventService(logger)
    const metricsService = new MetricsService(logger, prisma, event)
    const versionService = new JobVersionService(logger, prisma)

    // Initialize queue service
    const queue = new QueueService(config.database.url, logger, metricsService)

    // Initialize other services
    logger.info('Initializing scraper service')
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
    logger.info('Initializing job events and registry')
    this.jobEvents = new JobEvents(event, logger)
    this.jobRegistry = new JobRegistry(this.services, logger)

    this.workflowService = new WorkflowService(queue, logger)
    this.schedulerService = new SchedulerService(queue, logger)

    // Initialize shutdown service last
    this.shutdownService = new ShutdownService(logger, queue, metricsService, scraper, prisma)
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
      if (typeof job['beforeProcess'] === 'function') {
        try {
          this.services.logger.info(`Getting initial data for job ${jobName}`)
          jobData = await job['beforeProcess']()
          this.services.logger.info(`Got initial data for job ${jobName}`, {
            dataSize: Array.isArray(jobData) ? jobData.length : 'N/A',
            sampleData: JSON.stringify(jobData).slice(0, 1000),
          })
        } catch (error: any) {
          this.services.logger.error(`Failed to get initial data for job ${jobName}`, {
            ...error,
          })
          throw error
        }
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

  async start(testJobName?: string) {
    try {
      this.services.logger.info('Starting application initialization')

      // Initialize database connection
      this.services.logger.info('Connecting to database')
      await this.services.prisma.connect()

      // Start core services
      this.services.logger.info('Starting queue service')
      await this.services.queue.start()

      this.services.logger.info('Initializing scraper')
      await this.services.scraper.init()

      // Initialize jobs
      this.services.logger.info('Initializing job registry')
      await this.jobRegistry.initialize()

      // Initialize schedules
      this.services.logger.info('Initializing job schedules')
      await this.schedulerService.initializeSchedules()

      // If a test job is specified, run it immediately
      if (testJobName) {
        this.services.logger.info(`Running test job: ${testJobName}`)
        await this.testJob(testJobName)
      }

      this.services.logger.info('Application started successfully', {
        testJob: testJobName || 'none',
        timestamp: new Date().toISOString(),
      })
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

      await this.services.queue.stop()
      await this.services.scraper.cleanup()
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
