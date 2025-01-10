// src/core/services/queue.service.ts
import PgBoss from 'pg-boss'
import pool from 'pg-pool'
import type { Pool } from 'pg'

import { CustomLogger } from './logger.service'
import { MetricsService } from './metrics.service'
import { PrismaService } from './prisma.service'
import { job_status } from '@prisma/client'
import type { WorkflowJob, WorkflowJobData } from '@types'

export interface QueueOptions {
  timeout?: number
  startAfter?: string
  singletonKey?: string
  priority?: number | 'low' | 'normal' | 'high' | 'critical'
  retryLimit?: number
  retryDelay?: number
  retryBackoff?: boolean
  expireInSeconds?: number
  expireInMinutes?: number
  expireInHours?: number
  retentionSeconds?: number
  retentionMinutes?: number
  retentionHours?: number
  retentionDays?: number
  deadLetter?: string
}

export type QueuePolicy = 'standard' | 'short' | 'singleton' | 'stately'

export interface Queue extends QueueOptions {
  name: string
  policy?: QueuePolicy
}

export interface StopOptions {
  wait?: boolean
  graceful?: boolean
  close?: boolean
  timeout?: number
}

export class QueueService {
  private boss: PgBoss | null = null
  private pgPool: Pool | null = null
  private isStarted = false
  private prisma: PrismaService

  constructor(
    private readonly connectionString: string,
    private readonly logger: CustomLogger,
    private readonly metrics: MetricsService,
  ) {
    this.logger.setDomain('jobs')
    this.prisma = new PrismaService(logger)
  }

  async start(): Promise<void> {
    if (!this.boss) {
      throw new Error('Queue service not initialized. Call init() first')
    }

    try {
      await this.boss?.start()
      this.isStarted = true
      this.logger.info('Queue service started successfully')
    } catch (error: any) {
      this.logger.error('Failed to start queue service', {
        error,
      })
      throw error
    }
  }

  // Modify your init() method to include monitoring
  async init(): Promise<void> {
    try {
      const isSupabase = this.connectionString.includes('supabase')
      // Initialize pg Pool
      this.pgPool = new pool({
        connectionString: this.connectionString,
        ssl: isSupabase
          ? {
              rejectUnauthorized: false,
            }
          : false, // Disable SSL for local development
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      })

      // Test the connection
      await this.pgPool.query('SELECT 1')
      this.logger.info('Database pool initialized successfully')

      // Drop the pgboss schema if it exists
      await this.pgPool.query('DROP SCHEMA IF EXISTS pgboss CASCADE')
      this.logger.info('Cleaned up existing pgboss schema')

      this.boss = new PgBoss({
        db: {
          executeSql: async (text: string, values?: any[]) => {
            if (!this.pgPool) throw new Error('Database pool not initialized')
            return await this.pgPool.query(text, values)
          },
        },
        schema: 'pgboss',
        application_name: 'jobs_service',
        monitorStateIntervalMinutes: 1, // Check every minute
        archiveCompletedAfterSeconds: 43200,
        deleteAfterDays: 7,
        maintenanceIntervalMinutes: 5,
      })

      // Set up event handlers for monitoring
      this.boss.on('monitor-states', async (states) => {
        this.logger.info('Queue health check', {
          states,
          timestamp: new Date().toISOString(),
        })

        try {
          const stats = {
            created: Number(states.created) || 0,
            retry: Number(states.retry) || 0,
            active: Number(states.active) || 0,
            completed: Number(states.completed) || 0,
            cancelled: Number(states.cancelled) || 0,
            failed: Number(states.failed) || 0,
            all: Object.values(states).reduce(
              (sum: number, val: any) => sum + (Number(val) || 0),
              0,
            ),
          }

          await this.metrics.trackQueueStats('overall', stats)
        } catch (error: any) {
          this.logger.error('Failed to track queue stats', {
            error,
          })
        }
      })

      // Monitor active workers
      this.boss.on('wip', (workers) => {
        this.logger.debug('Active workers', {
          count: workers.length,
          workers: workers.map((w) => ({
            id: w.id,
            name: w.name,
            state: w.state,
            count: w.count,
            lastError: w.lastError,
          })),
          timestamp: new Date().toISOString(),
        })
      })

      await this.boss.start()
      this.logger.info('Queue service started successfully')
    } catch (error: any) {
      this.logger.error('Failed to initialize queue service', {
        error,
      })
      throw error
    }
  }

  // Add a method to get queue statistics on demand
  async getQueueStats(): Promise<Record<string, number>> {
    if (!this.boss) {
      throw new Error('Queue service not initialized')
    }

    // Use raw query to get stats since pg-boss doesn't expose direct API
    const query = `
      SELECT 
        count(*) FILTER (WHERE state = 'created') as created,
        count(*) FILTER (WHERE state = 'retry') as retry,
        count(*) FILTER (WHERE state = 'active') as active,
        count(*) FILTER (WHERE state = 'completed') as completed,
        count(*) FILTER (WHERE state = 'failed') as failed,
        count(*) FILTER (WHERE state = 'cancelled') as cancelled,
        count(*) as total
      FROM ${this.boss.constructor.name}.job
    `

    try {
      const result = await this.pgPool?.query(query)
      return (
        result?.rows[0] || {
          created: 0,
          retry: 0,
          active: 0,
          completed: 0,
          failed: 0,
          cancelled: 0,
          total: 0,
        }
      )
    } catch (error: any) {
      this.logger.error('Failed to get queue stats', { error })
      throw error
    }
  }

  public async trackJobMetrics(jobName: string, jobId: string, data: JobMetricsData) {
    try {
      const metricId = jobId || crypto.randomUUID()

      await this.prisma.job_metrics.upsert({
        where: {
          id: jobId,
        },
        create: {
          id: metricId,
          job_id: jobId,
          job_name: jobName,
          started_at: new Date(),
          status: data.status,
          metadata: data.metadata || {},
          error_message: data.error_message,
          error_stack: data.error_stack,
          duration_ms: data.duration_ms,
          items_processed: data.items_processed,
        },
        update: {
          status: data.status,
          metadata: data.metadata,
          error_message: data.error_message,
          error_stack: data.error_stack,
          duration_ms: data.duration_ms,
          items_processed: data.items_processed,
          updated_at: new Date(),
          ...(data.status === 'completed' ? { completed_at: new Date() } : {}),
          ...(data.status === 'failed' ? { failed_at: new Date() } : {}),
        },
      })
    } catch (error: any) {
      this.logger.error('Failed to track job metrics', { error, context: { jobName, jobId } })
    }
  }

  async processJob(name: string, handler: (job: PgBoss.Job) => Promise<any>): Promise<void> {
    if (!this.boss) throw new Error('Queue service not started')

    try {
      await this.boss.work(name, async (job) => {
        const startTime = Date.now()
        const jobId = job.id || crypto.randomUUID()

        try {
          // Track job start
          console.log('Tracking job metrics', { name, job: job })
          await this.trackJobMetrics(name, jobId, {
            status: 'active',
            started_at: new Date(),
          })

          // Process the job
          const result = await handler(job)

          // Track successful completion
          await this.trackJobMetrics(name, jobId, {
            status: 'completed',
            duration_ms: Date.now() - startTime,
            items_processed: Array.isArray(result) ? result.length : undefined,
            metadata: { result },
          })

          return { state: 'completed', result }
        } catch (error: any) {
          // Track failure
          await this.trackJobMetrics(name, jobId, {
            status: 'failed',
            duration_ms: Date.now() - startTime,
            error_message: error.message,
            error_stack: error.stack,
            metadata: { error: { message: error.message, stack: error.stack } },
          })

          throw error
        }
      })
    } catch (error: any) {
      this.logger.error(`Failed to register worker: ${name}`, { error })
      throw error
    }
  }

  async getJobStats(
    options: {
      jobName?: string
      status?: string
      startDate?: Date
      endDate?: Date
    } = {},
  ) {
    const { jobName, status, startDate, endDate } = options

    return this.prisma.job_metrics.groupBy({
      by: ['job_name', 'status'],
      where: {
        ...(jobName && { job_name: jobName }),
        ...(status && { status: status as job_status }),
        ...(startDate && { created_at: { gte: startDate } }),
        ...(endDate && { created_at: { lte: endDate } }),
      },
      _count: {
        _all: true,
      },
      _avg: {
        duration_ms: true,
        items_processed: true,
      },
    })
  }

  async getJobConfigs() {
    return this.prisma.job_configs.findMany({
      where: {
        enabled: true,
      },
    })
  }

  async updateQueueStats(queueName: string, stats: Record<string, number>) {
    await this.prisma.job_queue_stats.upsert({
      where: { queue_name: queueName },
      create: {
        queue_name: queueName,
        active_count: stats.active || 0,
        created_count: stats.created || 0,
        completed_count: stats.completed || 0,
        failed_count: stats.failed || 0,
        cancelled_count: stats.cancelled || 0,
        retry_count: stats.retry || 0,
        total_count: stats.total || 0,
      },
      update: {
        active_count: stats.active || 0,
        created_count: stats.created || 0,
        completed_count: stats.completed || 0,
        failed_count: stats.failed || 0,
        cancelled_count: stats.cancelled || 0,
        retry_count: stats.retry || 0,
        total_count: stats.total || 0,
        updated_at: new Date(),
      },
    })
  }

  // Add method to get job performance metrics
  async getJobPerformanceMetrics(jobName: string, period: 'hour' | 'day' | 'week' = 'day') {
    const startDate = new Date()
    switch (period) {
      case 'hour':
        startDate.setHours(startDate.getHours() - 1)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      default:
        startDate.setDate(startDate.getDate() - 1)
    }

    return this.prisma.job_metrics.findMany({
      where: {
        job_name: jobName,
        created_at: { gte: startDate },
      },
      orderBy: { created_at: 'desc' },
      select: {
        status: true,
        duration_ms: true,
        items_processed: true,
        created_at: true,
        error_message: true,
      },
    })
  }

  // Add method to get stats for a specific queue
  async getQueueSize(name: string): Promise<number | null> {
    try {
      return (await this.boss?.getQueueSize(name)) || 0
    } catch (error: any) {
      this.logger.error(`Failed to get queue size for ${name}`, { error })
      return null
    }
  }

  async stop(options: StopOptions = {}): Promise<void> {
    try {
      if (this.boss) {
        await this.boss?.stop(options)
      }
      if (this.pgPool) {
        await this.pgPool.end()
      }
      this.isStarted = false
      this.logger.info('Queue service stopped')
    } catch (error: any) {
      this.logger.error('Failed to stop queue service', error)
      throw error
    }
  }

  // Update all other methods to check for this.boss existence
  private checkInitialized(): void {
    if (!this.boss) {
      throw new Error('Queue service not initialized. Call init() first')
    }
  }

  async clearStorage(): Promise<void> {
    try {
      this.checkInitialized()

      await this.boss?.clearStorage()
      this.logger.info('Successfully cleared queue storage')
    } catch (error: any) {
      this.logger.error('Failed to clear storage', error)
      throw error
    }
  }

  async createQueue(name: string, options: Queue): Promise<void> {
    try {
      this.checkInitialized()

      await this.boss?.createQueue(name, options)
      this.logger.info(`Queue created: ${name}`, { options })
    } catch (error: any) {
      this.logger.error(`Failed to create queue: ${name}`, {
        ...error,
        options,
      })
      throw error
    }
  }

  async updateQueue(name: string, options: PgBoss.Queue): Promise<void> {
    try {
      this.checkInitialized()

      await this.boss?.updateQueue(name, options)
      this.logger.info(`Queue updated: ${name}`, { options })
    } catch (error: any) {
      this.logger.error(`Failed to update queue: ${name}`, {
        ...error,
        options,
      })
      throw error
    }
  }

  async addJob(name: string, data: any, options: QueueOptions = {}) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      const jobId = await this.boss?.send(name, data, {
        ...options,
        priority: this.convertPriorityToInteger(options.priority),
        retryLimit: options.retryLimit ?? 3,
        retryDelay: options.retryDelay ?? 60,
        expireInSeconds: options.expireInSeconds ?? 3600,
      })

      if (!jobId) {
        this.logger.warn(`Job throttled: ${name}`)
        return null
      }

      this.logger.info(`Job added: ${name}`, { jobId, options })
      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to add job: ${name}`, {
        ...error,
        options,
      })
      throw error
    }
  }

  async getSchedules() {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      return await this.boss?.getSchedules()
    } catch (error: any) {
      this.logger.error('Failed to get schedules', {
        ...error,
      })
      throw error
    }
  }

  async unscheduleJob(name: string) {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      await this.boss?.unschedule(name)
      this.logger.info(`Unscheduled job: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to unschedule job: ${name}`, {
        ...error,
      })
      throw error
    }
  }

  async getWorkflowJob(name: string, jobId: string): Promise<WorkflowJob | null> {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      const job = await this.boss?.getJobById(name, jobId)

      if (!job) {
        this.logger.warn('Job not found', {
          name,
          jobId,
        })
        return null
      }

      return {
        id: job.id,
        name: job.name,
        data: job.data as WorkflowJobData,
        priority: job.priority,
        state: job.state as WorkflowJob['state'],
        startedAt: job.startedOn,
        completedAt: job.completedOn ?? undefined,
        createdAt: job.createdOn,
      }
    } catch (error: any) {
      this.logger.error('Failed to get workflow job', {
        ...error,
        name,
        jobId,
      })
      throw error
    }
  }

  private convertPriorityToInteger(
    priority?: number | 'low' | 'normal' | 'high' | 'critical',
  ): number {
    if (typeof priority === 'number') {
      return priority
    }

    // Default priority mapping
    const priorityMap: Record<string, number> = {
      low: 0,
      normal: 100,
      high: 200,
      critical: 300,
    }

    return priorityMap[priority || 'normal'] || 100
  }

  async scheduleJob(name: string, cronSchedule: string, data: any, options: QueueOptions = {}) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      // First create the queue
      await this.boss?.createQueue(name)
      this.logger.info(`Created queue: ${name}`)

      // Then remove any existing schedules
      try {
        await this.boss?.unschedule(name)
        this.logger.info(`Unscheduled existing job: ${name}`)
      } catch (error) {
        // Ignore errors if schedule doesn't exist
        this.logger.debug(`No existing schedule found for: ${name}`)
      }

      // Now schedule the new job
      const jobId = await this.boss?.schedule(name, cronSchedule, data, {
        retryLimit: options.retryLimit ?? 3,
        retryDelay: 60,
        priority: this.convertPriorityToInteger(options.priority),
      })

      this.logger.info(`Scheduled job ${name}`, {
        jobId,
        cronSchedule,
        scheduleTime: new Date().toISOString(),
      })

      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to schedule job ${name}`, {
        error,
      })
      throw error
    }
  }

  private async createQueueIfNotExists(name: string) {
    try {
      // First check if queue exists
      const queue = await this.boss?.getQueue(name)

      if (!queue) {
        this.logger.info(`Creating queue: ${name}`)
        try {
          await this.boss?.createQueue(name)
        } catch (error: any) {
          // If the error is "relation already exists" (code 42P07), we can ignore it
          // This happens in race conditions when multiple workers try to create the same queue
          if (error.code === '42P07') {
            this.logger.info(`Queue ${name} already exists, continuing...`)
            return
          }
          throw error
        }
      } else {
        this.logger.debug(`Queue ${name} already exists`)
      }
    } catch (error: any) {
      this.logger.error(`Failed to create queue: ${name}`, {
        error_code: error.code,
        error_message: error.message,
        error_detail: error.detail,
        error_hint: error.hint,
        ...error,
      })
      throw error
    }
  }

  async unschedule(name: string): Promise<void> {
    try {
      await this.boss?.unschedule(name)
      this.logger.info(`Unscheduled jobs for: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to unschedule jobs: ${name}`, {
        ...error,
      })
      throw error
    }
  }

  async purgeQueue(name: string) {
    await this.boss?.purgeQueue(name)
    this.logger.info(`Queue purged: ${name}`)
  }

  async deleteQueue(name: string) {
    await this.boss?.deleteQueue(name)
    this.logger.info(`Queue deleted: ${name}`)
  }

  async getQueues() {
    return this.boss?.getQueues()
  }

  async getQueue(name: string) {
    return this.boss?.getQueue(name)
  }

  // Job management
  async completeJob(name: string, jobId: string, data?: any) {
    await this.boss?.complete(name, jobId, data)
    this.logger.info(`Job completed: ${name}`, { jobId })
  }

  async failJob(name: string, jobId: string, error: Error) {
    await this.boss?.fail(name, jobId, error)
    this.logger.info(`Job failed: ${name}`, { jobId, error })
  }

  async cancelJob(name: string, jobId: string) {
    await this.boss?.cancel(name, jobId)
    this.logger.info(`Job cancelled: ${name}`, { jobId })
  }

  async resumeJob(name: string, jobId: string) {
    await this.boss?.resume(name, jobId)
    this.logger.info(`Job resumed: ${name}`, { jobId })
  }

  async getJobById(name: string, id: string) {
    return this.boss?.getJobById(name, id)
  }

  async deleteJob(name: string, jobId: string) {
    await this.boss?.deleteJob(name, jobId)
    this.logger.info(`Job deleted: ${name}`, { jobId })
  }

  // Utility methods
  async isInstalled(): Promise<Boolean> {
    return this.boss?.isInstalled() ?? false
  }

  async getSchemaVersion(): Promise<Number> {
    return this.boss?.schemaVersion() ?? 0
  }

  private serializeData(data: any): any {
    try {
      this.logger.debug('Attempting to serialize data', {
        dataType: typeof data,
        isArray: Array.isArray(data),
        keys: data ? Object.keys(data) : null,
        sample: data ? JSON.stringify(data).slice(0, 100) + '...' : null,
      })

      // Wrap the data in an object
      const wrappedData = { data }
      const jsonString = JSON.stringify(wrappedData)
      const parsed = JSON.parse(jsonString)

      this.logger.debug('Data serialized successfully', {
        resultType: typeof parsed,
        isArray: Array.isArray(parsed),
        sample: JSON.stringify(parsed).slice(0, 100) + '...',
      })

      return parsed
    } catch (error: any) {
      this.logger.error('Failed to serialize job data', {
        ...error,
        dataType: typeof data,
        isArray: Array.isArray(data),
        keys: data ? Object.keys(data) : null,
      })
      return { data: {} }
    }
  }

  async testJob(name: string, data: any = {}, options: QueueOptions = {}) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      await this.createQueueIfNotExists(name)

      this.logger.info(`Testing job immediately: ${name}`, {
        options,
        dataSize: Array.isArray(data) ? data.length : 'N/A',
      })

      // Serialize the data to ensure it can be stored in PostgreSQL
      const serializedData = this.serializeData(data)

      const jobId = await this.boss?.send(name, serializedData, {
        retryLimit: options.retryLimit ?? 3,
        retryDelay: 60,
        priority: this.convertPriorityToInteger('critical'), // Use critical priority for test runs
        startAfter: new Date(), // Start immediately
      })

      this.logger.info(`Test job queued: ${name}`, {
        jobId,
        options,
      })

      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to test job ${name}`, {
        ...error,
        options,
      })
      throw error
    }
  }
}
