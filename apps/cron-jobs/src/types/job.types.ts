// src/types/job.types.ts
import PgBoss from 'pg-boss'
import type {
  PrismaService,
  EventService,
  ScraperService,
  QueueService,
  CustomLogger,
  MetricsService,
} from '@core'
import type { JobVersionService } from '../jobs/utils/job-version.service'
import type { BaseJob } from '../jobs/job.base'
import type { DomainKey, PriorityLevel } from './domain.types'
import type { ScheduleConfig } from './schedule.types'

// Required services for jobs
export interface JobServices {
  queue: QueueService
  scraper: ScraperService
  logger: CustomLogger
  event: EventService
  metrics: MetricsService
  prisma: PrismaService
  version: JobVersionService
}

export type JobClass = new (services: JobServices) => BaseJob

// Job status types
export type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'retrying'

export type JobName =
  | 'news_links'
  | 'news_pages'
  | 'news_summary'
  | 'company_pages'
  | 'company_spider'
  | 'update_scrape_frequency'
  | 'daily_newsletter'

export interface JobMetadata {
  name: JobName
  domain: DomainKey
  description: string
  priority: 'low' | 'normal' | 'high' | 'critical'
  schedule: ScheduleConfig
  timeout?: number
  retryLimit?: number
  tags?: string[]
}

export interface BatchConfig {
  batchSize: number
  processSize: number
  maxPages?: number
  maxItems?: number
}

export interface CircuitBreakerConfig {
  enabled: boolean
  failureThreshold?: number
  resetTimeout?: number
  halfOpenRetries?: number
}

export interface JobHandlers<TInput = any, TProcessed = any, TOutput = any> {
  fetchFunction: (
    client: PrismaService,
    config: BatchConfig,
    options?: { limit?: number; offset?: number },
  ) => Promise<TInput[]>

  processFunction: (rows: TInput[], config: BatchConfig) => Promise<TProcessed[]>

  storeFunction: (client: PrismaService, processedData: TProcessed[]) => Promise<TOutput>

  onSuccess?: (result: TOutput) => Promise<void>
  onError?: (error: Error) => Promise<void>
}

export interface JobConfig<TInput = any, TProcessed = any, TOutput = any>
  extends JobMetadata,
    BatchConfig {
  circuitBreaker?: CircuitBreakerConfig
  dependencies?: JobName[]
  handlers: JobHandlers<TInput, TProcessed, TOutput>
}
