// src/infrastructure/services/metrics.service.ts
import { CustomLogger } from './logger.service'
import { PrismaService } from './prisma.service'
import { EventService } from './event.service'

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

  private async calculateJobDuration(jobId: string): Promise<number> {
    const metric = await this.prisma.job_metrics.findFirst({
      where: { job_id: jobId, status: 'active' },
    })
    return metric ? Date.now() - metric.started_at.getTime() : 0
  }

  async trackJobStart(jobName: string, jobId: string) {
    this.logger.debug(`Tracking job start: ${jobName}`, { jobId })
    await this.prisma.job_metrics.create({
      data: {
        job_id: jobId,
        job_name: jobName,
        status: 'active',
        started_at: new Date(),
      },
    })
  }

  async trackJobSuccess(jobName: string, duration: number, itemsProcessed?: number) {
    this.logger.debug(`Tracking job success: ${jobName}`, { duration, itemsProcessed })
    await this.prisma.job_metrics.updateMany({
      where: { job_name: jobName, status: 'active' },
      data: {
        status: 'completed',
        duration_ms: duration,
        items_processed: itemsProcessed,
        completed_at: new Date(),
      },
    })
  }

  async trackJobFailure(jobName: string, duration: number, error: Error) {
    this.logger.debug(`Tracking job failure: ${jobName}`, { duration, error })
    await this.prisma.job_metrics.updateMany({
      where: { job_name: jobName, status: 'active' },
      data: {
        status: 'failed',
        duration_ms: duration,
        error_message: error.message,
        failed_at: new Date(),
      },
    })
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
      await this.prisma.job_queue_stats.upsert({
        where: { queue_name: queueName },
        create: {
          queue_name: queueName,
          ...stats,
          updated_at: new Date(),
        },
        update: {
          ...stats,
          updated_at: new Date(),
        },
      })
    } catch (error: any) {
      this.logger.error(`Failed to track queue stats for ${queueName}`, { ...error, stats })
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

    return this.prisma.job_metrics.findMany({
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
  }

  async getSystemMetrics() {
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
  }
}
