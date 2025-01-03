// src/core/services/queue.service.ts
import PgBoss from 'pg-boss'
import pool from 'pg-pool'
import type { Pool } from 'pg'

import { CustomLogger } from './logger.service'
import { MetricsService } from './metrics.service'
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

  constructor(
    private readonly connectionString: string,
    private readonly logger: CustomLogger,
    private readonly metrics: MetricsService,
  ) {
    this.logger.setDomain('jobs')
  }

  // postgresql://postgres:[YOUR-PASSWORD]@db.idsifamzvzlpgnmlnldw.supabase.co:5432/postgres
  // postgresql://postgres.idsifamzvzlpgnmlnldw:XH8dQ64z191A2QMU@aws-0-ap-south-1.pooler.supabase.com:6543/postgres

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

      // Initialize pg-boss
      this.boss = new PgBoss({
        db: {
          executeSql: async (text: string, values?: any[]) => {
            if (!this.pgPool) throw new Error('Database pool not initialized')
            return await this.pgPool.query(text, values)
          },
        },
        schema: 'pgboss',
        application_name: 'jobs_service',
        monitorStateIntervalMinutes: 1,
        archiveCompletedAfterSeconds: 43200,
        deleteAfterDays: 7,
        maintenanceIntervalMinutes: 5,
      })

      this.setupEventHandlers()
      this.logger.info('Queue service initialized')
    } catch (error: any) {
      this.logger.error('Failed to initialize queue service', {
        error,
      })
      throw error
    }
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

  private setupEventHandlers() {
    // Error handling
    this.boss?.on('error', (error: any) => {
      this.logger.error('Queue error', {
        ...error,
      })
    })

    // State monitoring
    this.boss?.on('monitor-states', async (states: any) => {
      this.logger.debug('Queue states', {
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
          all: Object.values(states).reduce((sum: number, val: any) => sum + (Number(val) || 0), 0),
        }
        this.logger.debug('Tracking queue stats: overall')
        await this.metrics.trackQueueStats('overall', stats)
      } catch (error: any) {
        this.logger.error('Failed to track queue stats', {
          states,
          error_message: error.message,
          error_stack: error.stack,
          timestamp: new Date().toISOString(),
          ...error,
        })
      }
    })

    // Worker monitoring
    this.boss?.on('wip', (workers) => {
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

    // Lifecycle events
    this.boss?.on('stopped', () => {
      this.isStarted = false
      this.logger.info('Queue service stopped', {
        timestamp: new Date().toISOString(),
      })
    })
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

  // need to fetch with raw SQL
  // async getActiveJobs(name?: string): Promise<PgBoss.Job[]> {
  //   if (!this.isStarted) {
  //     throw new Error('Queue service not started')
  //   }

  //   try {
  //     return await this.boss?.(name)
  //   } catch (error: any) {
  //     this.logger.error('Failed to get active jobs', {
  //       ...error,
  //       name,
  //     })
  //     throw error
  //   }
  // }

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

  async processJob(name: string, handler: (job: PgBoss.Job<unknown>[]) => Promise<any>) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      await this.boss?.work(name, async (job) => {
        const startTime = Date.now()

        try {
          await this.createQueueIfNotExists(name)

          this.logger.info(`Processing job: ${name}`, {
            job: job,
            startTime: new Date().toISOString(),
          })

          const result = await handler(job)

          const duration = Date.now() - startTime
          this.logger.info(`Job completed: ${name}`, {
            duration,
            result: JSON.stringify(result).slice(0, 1000), // Log first 1000 chars of result
            endTime: new Date().toISOString(),
          })

          await this.metrics.trackJobCompletion(name, {
            duration,
            success: true,
          })

          return { state: 'completed', result }
        } catch (error: any) {
          const duration = Date.now() - startTime

          this.logger.error(`Job failed: ${name}`, {
            ...error,
            job: JSON.stringify(job),
            duration,
            error_message: error.message,
            error_stack: error.stack,
            failTime: new Date().toISOString(),
          })

          await this.metrics.trackJobCompletion(name, {
            duration,
            success: false,
            error,
          })

          throw error
        }
      })

      this.logger.info(`Worker registered for: ${name}`, {
        timestamp: new Date().toISOString(),
      })
    } catch (error: any) {
      this.logger.error(`Failed to register worker: ${name}`, {
        ...error,
        error_message: error.message,
        error_stack: error.stack,
        timestamp: new Date().toISOString(),
      })
      throw error
    }
  }

  // Queue management
  async getQueueSize(name: string) {
    return this.boss?.getQueueSize(name)
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
