// src/core/services/shutdown.service.ts
import { CustomLogger } from './services/logger.service'
import { QueueService } from './services/queue.service'
import { MetricsService } from './services/metrics.service'
import { ScraperService } from './services/scraper.service'
import { PrismaService } from './services/prisma.service'

export class ShutdownService {
  private isShuttingDown = false

  constructor(
    private readonly logger: CustomLogger,
    private readonly queueService: QueueService,
    private readonly metricsService: MetricsService,
    private readonly scraperService: ScraperService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setDomain('job_shutdown')
    this.setupShutdownHandlers()
  }

  private setupShutdownHandlers() {
    process.on('SIGTERM', () => this.handleShutdown('SIGTERM'))
    process.on('SIGINT', () => this.handleShutdown('SIGINT'))
    process.on('unhandledRejection', (reason) => {
      this.logger.error('Unhandled Promise rejection', { name: '', message: String(reason) })
    })
    process.on('uncaughtException', (error: any) => {
      this.logger.error('Uncaught exception', error)
      void this.handleShutdown('UNCAUGHT_EXCEPTION')
    })
  }

  private async handleShutdown(signal: string) {
    if (this.isShuttingDown) {
      this.logger.info('Shutdown already in progress')
      return
    }

    this.isShuttingDown = true
    this.logger.info(`Received ${signal}. Starting graceful shutdown...`)

    try {
      // Stop accepting new jobs
      this.logger.info('Stopping job queue...')
      await this.queueService.stop()

      // Wait for active jobs to complete (with timeout)
      this.logger.info('Waiting for active jobs to complete...')
      await this.waitForActiveJobs()

      // Cleanup other services
      this.logger.info('Cleaning up services...')
      await Promise.allSettled([
        this.scraperService.cleanup(),
        this.prisma.$disconnect(),
        this.metricsService.flush(),
      ])

      this.logger.info('Graceful shutdown completed')
      process.exit(0)
    } catch (error: any) {
      this.logger.error('Error during shutdown', error)
      process.exit(1)
    }
  }

  private async waitForActiveJobs(timeout: number = 30000): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const activeJobs = await this.queueService.getActiveJobs()

      if (activeJobs.length === 0) {
        return
      }

      this.logger.info(`Waiting for ${activeJobs.length} active jobs...`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    this.logger.warn('Timeout waiting for active jobs')
  }
}
