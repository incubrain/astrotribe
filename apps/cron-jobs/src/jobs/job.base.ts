// src/jobs/job-base.ts
import { DomainsForService, Service } from '@ib/logger'
import { PrismaClient } from '@prisma/client'
import { QueueService, ScraperService, CustomLogger, EventService } from '@core'
import { JobVersionService } from './utils/job-version.service'
import { DatabaseUtils } from './utils/database.utils'
import type { QueueJob, JobServices, JobConfig, JobSchedule } from '@types'

// Update BaseJob to use events
// src/jobs/base.job.ts
export abstract class BaseJob<TInput = any, TProcessed = any, TOutput = any> {
  abstract readonly name: string
  abstract readonly version: string
  abstract readonly changes: string[]
  abstract readonly schedule?: JobSchedule

  constructor(protected readonly services: JobServices) {
    this.services.logger.setDomain(this.getDomain())
    void this.registerVersion()
  }

  // Core utility methods
  protected async handleFailure(entity: any, error: Error) {
    return DatabaseUtils.handleEntityFailure(
      this.services.prisma,
      this.services.logger,
      this.tableName,
      entity,
      error,
      this.failureOptions,
    )
  }

  protected async executeBatchOperation<T, R>(items: T[], processor: (batch: T[]) => Promise<R[]>) {
    return DatabaseUtils.batchProcess({
      items,
      processor,
      logger: this.services.logger,
      batchSize: this.batchSize,
    })
  }

  protected async executeTransaction<T>(operation: (tx: PrismaClient) => Promise<T>) {
    return DatabaseUtils.executeTransaction({
      prisma: this.services.prisma,
      logger: this.services.logger,
      operation,
    })
  }

  protected convertBigInts(data: any) {
    return DatabaseUtils.convertBigIntToNumber(data)
  }

  // Configuration
  protected get tableName(): string {
    return ''
  }
  protected get batchSize(): number {
    return 1000
  }
  protected get failureOptions() {
    return { maxFailures: 3, disableAfterFailure: true }
  }

  // Abstract methods
  protected abstract getDomain(): DomainsForService<Service.JOBS>
  protected abstract getConfig(): Partial<JobConfig<TInput, TProcessed, TOutput>>
  abstract createJobConfig(): JobConfig<TInput, TProcessed, TOutput>

  // Version management
  private async registerVersion() {
    if (!this.version || !this.changes) {
      this.services.logger.warn(`Job ${this.name} missing version/changes`)
      return
    }

    try {
      const config = this.getConfig()
      await this.services.version.createVersion(this.name, this.version, this.changes, config)
    } catch (error: any) {
      this.services.logger.error('Failed to register version', { error })
    }
  }
}
