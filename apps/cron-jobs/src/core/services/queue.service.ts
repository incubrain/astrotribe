// src/core/services/queue.service.ts
import PgBoss from 'pg-boss'
import { CustomLogger } from './logger.service'
import { MetricsService } from './metrics.service'
import type { WorkflowJob, WorkflowJobData } from '@types'

export interface QueueOptions {
  timeout?: number
  startAfter?: string
  singletonKey?: string
  priority?: PgBoss.JobOptions['priority']
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
  private boss: PgBoss
  private isStarted = false

  constructor(
    private readonly connectionString: string,
    private readonly logger: CustomLogger,
    private readonly metrics: MetricsService,
  ) {
    this.boss = new PgBoss({
      connectionString,
      // Connection settings
      application_name: 'jobs_service',
      max: 20,
      // Monitoring
      monitorStateIntervalMinutes: 1,
      // Maintenance settings
      archiveCompletedAfterSeconds: 43200, // 12 hours
      deleteAfterDays: 7,
      maintenanceIntervalMinutes: 5,
    })

    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    // Error handling
    this.boss.on('error', (error: any) => {
      this.logger.error('Queue error', {
        ...error,
        message: `isStarted: ${String(this.isStarted)}`,
      })
    })

    // State monitoring
    this.boss.on('monitor-states', async (states) => {
      this.logger.debug('Queue states', { states })
      await this.metrics.trackQueueStats('overall', states)
    })

    // Worker monitoring
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
      })
    })

    // Lifecycle events
    this.boss.on('stopped', () => {
      this.isStarted = false
      this.logger.info('Queue service stopped')
    })
  }

  async start(): Promise<void> {
    try {
      await this.boss.start()
      this.isStarted = true
      this.logger.info('Queue service started')
    } catch (error: any) {
      this.logger.error('Failed to start queue service', { ...error })
      throw error
    }
  }

  async stop(options?: StopOptions): Promise<void> {
    const defaults = { wait: true, graceful: true, close: true, timeout: 30000 }
    const opts = { ...defaults, ...options }

    try {
      await this.boss.stop(opts)
      // 'stopped' event handler will update isStarted
      this.logger.info('Queue service stopping...', { options: opts })
    } catch (error: any) {
      this.logger.error('Failed to stop queue service', { ...error })
      throw error
    }
  }

  async createQueue(name: string, options: Queue): Promise<void> {
    try {
      await this.boss.createQueue(name, options)
      this.logger.info(`Queue created: ${name}`, { options })
    } catch (error: any) {
      this.logger.error(`Failed to create queue: ${name}`, { ...error, options })
      throw error
    }
  }

  async updateQueue(name: string, options: PgBoss.Queue): Promise<void> {
    try {
      await this.boss.updateQueue(name, options)
      this.logger.info(`Queue updated: ${name}`, { options })
    } catch (error: any) {
      this.logger.error(`Failed to update queue: ${name}`, { ...error, options })
      throw error
    }
  }

  async addJob(name: string, data: any, options: QueueOptions = {}) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      const jobId = await this.boss.send(name, data, {
        ...options,
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
      this.logger.error(`Failed to add job: ${name}`, { ...error, options })
      throw error
    }
  }

  async getActiveJobs(name?: string): Promise<PgBoss.Job[]> {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      return await this.boss.fetch(name)
    } catch (error: any) {
      this.logger.error('Failed to get active jobs', { ...error, name })
      throw error
    }
  }

  async getSchedules() {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      return await this.boss.getSchedules()
    } catch (error: any) {
      this.logger.error('Failed to get schedules', { ...error })
      throw error
    }
  }

  async unscheduleJob(name: string) {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      await this.boss.unschedule(name)
      this.logger.info(`Unscheduled job: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to unschedule job: ${name}`, { ...error })
      throw error
    }
  }

  async getWorkflowJob(name: string, jobId: string): Promise<WorkflowJob> {
    if (!this.isStarted) {
      throw new Error('Queue service not started')
    }

    try {
      const job = await this.boss.getJobById(name, jobId)
      return {
        id: job.id,
        name: job.name,
        data: job.data as WorkflowJobData,
        priority: job.priority,
        state: job.state as WorkflowJob['state'],
        startedAt: job.startedOn,
        completedAt: job.completedOn,
        createdAt: job.createdOn,
      }
    } catch (error: any) {
      this.logger.error('Failed to get workflow job', { ...error, name, jobId })
      throw error
    }
  }

  async scheduleJob(name: string, cronSchedule: string, data: any, options: QueueOptions = {}) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      await this.createQueueIfNotExists(name)

      this.logger.info(`Scheduling job: ${name} ${JSON.stringify(options)}`, {
        cronSchedule,
        options,
      })

      const jobId = await this.boss.schedule(name, cronSchedule, data, {
        retryLimit: options.retryLimit ?? 3,
        retryDelay: 60,
        priority: options.priority,
      })

      this.logger.info(`Scheduled job ${name}`, {
        jobId,
        cronSchedule,
        options,
      })

      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to schedule job ${name}`, {
        error,
        cronSchedule,
        options,
      })
      throw error
    }
  }

  private async createQueueIfNotExists(name: string) {
    try {
      // First check if queue exists
      const queue = await this.boss.getQueue(name)

      if (!queue) {
        this.logger.info(`Creating queue: ${name}`)
        await this.boss.createQueue(name, {
          teamSize: 1, // Number of workers
          teamConcurrency: 1, // Jobs per worker
          teamRefill: true, // Automatically assign new jobs
        })
      }
    } catch (error) {
      this.logger.error(`Failed to create queue: ${name}`, { error })
      throw error
    }
  }

  async unschedule(name: string): Promise<void> {
    try {
      await this.boss.unschedule(name)
      this.logger.info(`Unscheduled jobs for: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to unschedule jobs: ${name}`, error)
      throw error
    }
  }

  async processJob(name: string, handler: (job: PgBoss.Job<unknown>[]) => Promise<any>) {
    if (!this.isStarted) throw new Error('Queue service not started')

    try {
      await this.boss.work(name, async (job) => {
        const startTime = Date.now()

        try {
          await this.createQueueIfNotExists(name)

          this.logger.info(`Processing job: ${name}`, { jobId: job[0].id })
          const result = await handler(job)

          const duration = Date.now() - startTime
          await this.metrics.trackJobCompletion(name, {
            duration,
            success: true,
          })

          return { state: 'completed', result }
        } catch (error: any) {
          const duration = Date.now() - startTime

          this.logger.error(`Job failed: ${name} ${job[0].id}`, {
            ...error,
            duration,
          })

          await this.metrics.trackJobCompletion(name, {
            duration,
            success: false,
            error,
          })

          throw error
        }
      })

      this.logger.info(`Worker registered for: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to register worker: ${name}`, error)
      throw error
    }
  }

  // Queue management
  async getQueueSize(name: string) {
    return this.boss.getQueueSize(name)
  }

  async purgeQueue(name: string) {
    await this.boss.purgeQueue(name)
    this.logger.info(`Queue purged: ${name}`)
  }

  async deleteQueue(name: string) {
    await this.boss.deleteQueue(name)
    this.logger.info(`Queue deleted: ${name}`)
  }

  async getQueues() {
    return this.boss.getQueues()
  }

  async getQueue(name: string) {
    return this.boss.getQueue(name)
  }

  // Job management
  async completeJob(name: string, jobId: string, data?: any) {
    await this.boss.complete(name, jobId, data)
    this.logger.info(`Job completed: ${name}`, { jobId })
  }

  async failJob(name: string, jobId: string, error: Error) {
    await this.boss.fail(name, jobId, error)
    this.logger.info(`Job failed: ${name}`, { jobId, error })
  }

  async cancelJob(name: string, jobId: string) {
    await this.boss.cancel(name, jobId)
    this.logger.info(`Job cancelled: ${name}`, { jobId })
  }

  async resumeJob(name: string, jobId: string) {
    await this.boss.resume(name, jobId)
    this.logger.info(`Job resumed: ${name}`, { jobId })
  }

  async getJobById(name: string, id: string) {
    return this.boss.getJobById(name, id)
  }

  async deleteJob(name: string, jobId: string) {
    await this.boss.deleteJob(name, jobId)
    this.logger.info(`Job deleted: ${name}`, { jobId })
  }

  // Utility methods
  async isInstalled(): Promise<Boolean> {
    return this.boss.isInstalled()
  }

  async getSchemaVersion(): Promise<Number> {
    return this.boss.schemaVersion()
  }

  async clearStorage(): Promise<void> {
    await this.boss.clearStorage()
    this.logger.warn('Queue storage cleared')
  }
}
