// src/core/services/shutdown.service.ts
import { JobServices } from '@types'

export class ShutdownService {
  private isShuttingDown = false

  constructor(private readonly services: JobServices) {
    this.services.logger.setDomain('job_shutdown')
    this.setupShutdownHandlers()
  }

  private setupShutdownHandlers() {
    process.on('SIGTERM', () => this.handleShutdown('SIGTERM'))
    process.on('SIGINT', () => this.handleShutdown('SIGINT'))
    process.on('unhandledRejection', (reason) => {
      this.services.logger.error('Unhandled Promise rejection', { context: { message: String(reason) } })
    })
    process.on('uncaughtException', (error: any) => {
      this.services.logger.error('Uncaught exception', error)
      void this.handleShutdown('UNCAUGHT_EXCEPTION')
    })
  }

  private async handleShutdown(signal: string) {
    if (this.isShuttingDown) {
      this.services.logger.info('Shutdown already in progress')
      return
    }

    this.isShuttingDown = true
    this.services.logger.info(`Received ${signal}. Starting graceful shutdown...`)

    try {
      // Stop accepting new jobs
      this.services.logger.info('Stopping job queue...')
      await this.services.queue.stop()

      // Wait for active jobs to complete (with timeout)
      this.services.logger.info('Waiting for active jobs to complete...')
      await this.waitForActiveJobs()

      // Cleanup other services
      this.services.logger.info('Cleaning up services...')
      await Promise.allSettled([
        this.services.scraper.cleanup(),
        this.services.prisma.$disconnect(),
        this.services.metrics.flush(),
      ])

      this.services.logger.info('Graceful shutdown completed')
      process.exit(0)
    } catch (error: any) {
      this.services.logger.error('Error during shutdown', error)
      process.exit(1)
    }
  }

  private async waitForActiveJobs(timeout: number = 30000): Promise<void> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeout) {
      const activeJobs = await this.services.queue.getActiveJobs()

      if (activeJobs.length === 0) {
        return
      }

      this.services.logger.info(`Waiting for ${activeJobs.length} active jobs...`)
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    this.services.logger.warn('Timeout waiting for active jobs')
  }
}
