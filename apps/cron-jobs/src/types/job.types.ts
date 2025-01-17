// src/types/job.types.ts
import PgBoss from 'pg-boss'
import { DomainsForService, Service } from '@ib/logger'
import type {
  PrismaService,
  EventService,
  ScraperService,
  QueueService,
  CustomLogger,
  MetricsService,
} from '@core'
import type { JobVersionService } from '../jobs/job.versioning'
import type { ScheduleConfig } from './schedule.types'
import type { QueueJob } from './queue.types'

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

export type JobClass = new (services: JobServices) => PgBoss.Job

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
  domain: DomainsForService<Service.JOBS>
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

export interface JobSchedule {
  customCron: string
  type: 'cron' | 'interval'
  enabled: boolean
}

export interface JobHandlers<TInput, TProcessed, TOutput> {
  beforeProcess?: () => Promise<TInput[]>
  processFunction: (rows: TInput[], job: any) => Promise<TProcessed[]>
  afterProcess?: (processedData: TProcessed[]) => Promise<TOutput[]>
  onSuccess?: (result: TOutput) => Promise<void>
  onError?: (error: Error) => Promise<void>
}

export interface JobConfig<TInput, TProcessed, TOutput> {
  name: string
  domain: DomainsForService<Service.JOBS>
  version: string
  changes: string[]
  handlers: JobHandlers<TInput, TProcessed, TOutput>
  schedule?: {
    customCron: string
    type: 'cron' | 'interval'
    enabled: boolean
  }
  priority?: 'low' | 'normal' | 'high' | 'critical'
  batchSize?: number
  processSize?: number
  timeout?: number
  retryLimit?: number
  circuitBreaker?: {
    enabled: boolean
    failureThreshold: number
    resetTimeout: number
  }
  tags?: string[]
}
