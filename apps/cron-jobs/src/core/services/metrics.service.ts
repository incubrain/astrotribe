// src/infrastructure/services/metrics.service.ts
import { CustomLogger } from './logger.service'
import { PrismaService } from './prisma.service'
import { EventService } from './event.service'
import { error_type } from '@prisma/client'

export interface JobMetrics {
  duration: number
  success: boolean
  error?: Error
  itemsProcessed?: number
}

export interface QueueStats {
  created: number
  retry: number
  active: number
  completed: number
  cancelled: number
  failed: number
  all: number
}

export class MetricsService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.eventService.on('job.started', async (jobName: string, jobId: string) => {
      await this.trackJobStart(jobName, jobId)
    })

    this.eventService.on('job.completed', async (jobName: string, jobId: string, result: any) => {
      const duration = await this.calculateJobDuration(jobId)
      await this.trackJobSuccess(jobName, duration, result?.itemsProcessed)
    })

    this.eventService.on('job.failed', async (jobName: string, jobId: string, error: Error) => {
      const duration = await this.calculateJobDuration(jobId)
      await this.trackJobFailure(jobName, duration, error)
    })
  }

  public async flush() {
    this.logger.info('Flushing metrics...')
    // this.prisma.job_metrics.deleteMany()
    // this.prisma.job_queue_stats.deleteMany()
    // this.prisma.error_logs.deleteMany()
  }

  private async calculateJobDuration(jobId: string): Promise<number> {
    const metric = await this.prisma.job_metrics.findFirst({
      where: { job_id: jobId, status: 'active' },
    })
    return metric ? Date.now() - metric.started_at.getTime() : 0
  }

  async trackJobStart(jobName: string, jobId: string) {
    this.logger.debug(`Tracking job start: ${jobName}`, { jobId })
    try {
      await this.prisma.job_metrics.create({
        data: {
          job_id: jobId,
          job_name: jobName,
          status: 'active',
          started_at: new Date(),
        },
      })
    } catch (error: any) {
      await this.logError('Failed to track job start', error, {
        jobName,
        jobId,
      })
    }
  }

  async trackJobSuccess(jobName: string, duration: number, itemsProcessed?: number) {
    this.logger.debug(`Tracking job success: ${jobName}`, { duration, itemsProcessed })
    try {
      await this.prisma.job_metrics.updateMany({
        where: { job_name: jobName, status: 'active' },
        data: {
          status: 'completed',
          duration_ms: duration,
          items_processed: itemsProcessed,
          completed_at: new Date(),
        },
      })
    } catch (error: any) {
      await this.logError('Failed to track job success', error, {
        jobName,
        duration,
        itemsProcessed,
      })
    }
  }

  async trackJobFailure(jobName: string, duration: number, error: Error) {
    this.logger.debug(`Tracking job failure: ${jobName}`, { duration, error })
    try {
      await this.prisma.job_metrics.updateMany({
        where: { job_name: jobName, status: 'active' },
        data: {
          status: 'failed',
          duration_ms: duration,
          error_message: error.message,
          failed_at: new Date(),
        },
      })
      await this.logError('Job failed', error, {
        jobName,
        duration,
      })
    } catch (logError: any) {
      await this.logError('Failed to track job failure', logError, {
        jobName,
        duration,
        originalError: error.message,
      })
    }
  }

  async trackJobCompletion(jobName: string, metrics: JobMetrics) {
    this.logger.debug(`Tracking job completion: ${jobName}`, metrics)
    if (metrics.success) {
      await this.trackJobSuccess(jobName, metrics.duration, metrics.itemsProcessed)
    } else {
      await this.trackJobFailure(jobName, metrics.duration, metrics.error!)
    }
  }

  async trackQueueStats(queueName: string, stats: QueueStats) {
    this.logger.debug(`Tracking queue stats: ${queueName}`, stats)
    try {
      const data = {
        created_count: Math.max(0, Math.floor(Number(stats.created))),
        retry_count: Math.max(0, Math.floor(Number(stats.retry))),
        active_count: Math.max(0, Math.floor(Number(stats.active))),
        completed_count: Math.max(0, Math.floor(Number(stats.completed))),
        cancelled_count: Math.max(0, Math.floor(Number(stats.cancelled))),
        failed_count: Math.max(0, Math.floor(Number(stats.failed))),
        total_count: Math.max(0, Math.floor(Number(stats.all))),
        updated_at: new Date(),
      }

      await this.prisma.job_queue_stats.upsert({
        where: { queue_name: queueName },
        create: {
          queue_name: queueName,
          ...data,
        },
        update: data,
      })
    } catch (error: any) {
      await this.logError('Failed to track queue stats', error, {
        queueName,
        stats,
      })
    }
  }

  private async logError(message: string, error: Error, context: Record<string, any> = {}) {
    try {
      await this.prisma.error_logs.create({
        data: {
          service_name: 'jobs',
          error_type: error_type.DATABASE_ERROR,
          severity: 'high',
          message: `${message}: ${error.message}`,
          stack_trace: error.stack,
          metadata: context,
          environment: process.env.NODE_ENV || 'development',
          domain: context.jobName || 'metrics',
        },
      })
    } catch (logError: any) {
      this.logger.error('Failed to log to database:', logError)
    }
  }

  // Query methods
  async getJobMetrics(jobName: string, period: 'day' | 'week' | 'month') {
    const now = new Date()
    const startDate = new Date()

    switch (period) {
      case 'day':
        startDate.setDate(now.getDate() - 1)
        break
      case 'week':
        startDate.setDate(now.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(now.getMonth() - 1)
        break
    }

    try {
      return await this.prisma.job_metrics.findMany({
        where: {
          job_name: jobName,
          started_at: {
            gte: startDate,
          },
        },
        orderBy: {
          started_at: 'desc',
        },
      })
    } catch (error: any) {
      await this.logError('Failed to get job metrics', error, {
        jobName,
        period,
      })
      throw error
    }
  }

  async getSystemMetrics() {
    try {
      const [jobs, queues] = await Promise.all([
        this.prisma.job_metrics.groupBy({
          by: ['status'],
          _count: true,
          _avg: {
            duration_ms: true,
          },
        }),
        this.prisma.job_queue_stats.findMany(),
      ])

      return {
        jobs,
        queues,
        timestamp: new Date(),
      }
    } catch (error: any) {
      await this.logError('Failed to get system metrics', error)
      throw error
    }
  }
}
