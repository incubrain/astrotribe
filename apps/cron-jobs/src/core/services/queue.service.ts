// src/core/services/queue.service.ts
import { Injectable } from '@nestjs/common'
import { PgBoss } from 'pg-boss'
import { CustomLogger } from '@ib/logger'
import { MetricsService } from './metrics.service'
import { PrismaService } from './prisma.service'
import { JobStatus } from '@astronera/db'
import type { WorkflowJob, WorkflowJobData } from '@types'

export interface QueueOptions {
  name: string
  retryLimit?: number
  retryDelay?: number
  retryBackoff?: boolean
  expireInSeconds?: number
  keepUntil?: Date
}

@Injectable()
export class QueueService {
  private boss: PgBoss

  constructor(
    private readonly logger: CustomLogger,
    private readonly metrics: MetricsService,
    private readonly prisma: PrismaService,
  ) {
    this.logger.setDomain('jobs')
  }

  async initialize() {
    try {
      this.boss = new PgBoss({
        connectionString: process.env.DATABASE_URL,
        max: 1,
      })

      await this.boss.start()
      this.logger.info('Queue service initialized')
    } catch (error: any) {
      this.logger.error('Failed to initialize queue service', { error })
      throw error
    }
  }

  async cleanup() {
    try {
      await this.boss.stop()
      this.logger.info('Queue service cleaned up')
    } catch (error: any) {
      this.logger.error('Failed to cleanup queue service', { error })
    }
  }

  async trackJobMetrics(jobName: string, jobId: string, data: JobMetricsData) {
    try {
      const metricId = jobId || crypto.randomUUID()

      await this.prisma.jobMetrics.upsert({
        where: {
          id: jobId,
        },
        create: {
          id: metricId,
          jobName,
          status: data.status,
          duration: data.duration,
          itemsProcessed: data.itemsProcessed,
          metadata: data.metadata,
          performance: data.performance,
        },
        update: {
          status: data.status,
          duration: data.duration,
          itemsProcessed: data.itemsProcessed,
          metadata: data.metadata,
          performance: data.performance,
        },
      })
    } catch (error: any) {
      this.logger.error('Failed to track job metrics', { error })
    }
  }

  async getJobMetrics(options: {
    jobName?: string
    status?: JobStatus
    startDate?: Date
    endDate?: Date
  }) {
    const { jobName, status, startDate, endDate } = options

    return this.prisma.jobMetrics.groupBy({
      by: ['jobName', 'status'],
      where: {
        ...(jobName && { jobName }),
        ...(status && { status }),
        ...(startDate && { createdAt: { gte: startDate } }),
        ...(endDate && { createdAt: { lte: endDate } }),
      },
      _count: {
        id: true,
      },
      _avg: {
        duration: true,
        itemsProcessed: true,
      },
    })
  }

  async getJobConfigs() {
    return this.prisma.jobConfigs.findMany({
      where: {
        enabled: true,
      },
    })
  }

  async updateQueueStats(queueName: string, stats: Record<string, number>) {
    await this.prisma.jobQueueStats.upsert({
      where: { queueName },
      create: {
        queueName,
        createdCount: stats.created || 0,
        completedCount: stats.completed || 0,
        failedCount: stats.failed || 0,
        retryCount: stats.retry || 0,
        activeCount: stats.active || 0,
      },
      update: {
        createdCount: stats.created || 0,
        completedCount: stats.completed || 0,
        failedCount: stats.failed || 0,
        retryCount: stats.retry || 0,
        activeCount: stats.active || 0,
      },
    })
  }

  async getJobHistory(jobName: string, startDate: Date, endDate: Date) {
    if (!startDate || !endDate) {
      throw new Error('Start date and end date are required')
    }

    return this.prisma.jobMetrics.findMany({
      where: {
        jobName,
        createdAt: { gte: startDate },
        createdAt: { lte: endDate },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  }

  async enqueue<T extends WorkflowJobData>(job: WorkflowJob<T>, options: QueueOptions) {
    try {
      const jobId = await this.boss.send(options.name, job.data, {
        retryLimit: options.retryLimit,
        retryDelay: options.retryDelay,
        retryBackoff: options.retryBackoff,
        expireInSeconds: options.expireInSeconds,
        keepUntil: options.keepUntil,
      })

      this.logger.info(`Job enqueued: ${options.name}`, { jobId })
      return jobId
    } catch (error: any) {
      this.logger.error(`Failed to enqueue job: ${options.name}`, { error })
      throw error
    }
  }

  async subscribe<T extends WorkflowJobData>(
    name: string,
    handler: (job: WorkflowJob<T>) => Promise<any>,
  ) {
    try {
      await this.boss.work(name, async (job) => {
        const startTime = Date.now()
        const jobId = job.id || crypto.randomUUID()

        try {
          // Track job start
          await this.trackJobMetrics(name, jobId, {
            jobId,
            jobName: name,
            status: 'running',
            startTime,
            itemsProcessed: 0,
          })

          // Process the job
          const result = await handler(job)

          // Track successful completion
          await this.trackJobMetrics(name, jobId, {
            jobId,
            jobName: name,
            status: 'completed',
            duration: Date.now() - startTime,
            itemsProcessed: result?.itemsProcessed || 0,
            metadata: result?.metadata,
            performance: result?.performance,
          })

          return result
        } catch (error: any) {
          // Track failure
          await this.trackJobMetrics(name, jobId, {
            jobId,
            jobName: name,
            status: 'failed',
            duration: Date.now() - startTime,
            error,
          })

          throw error
        }
      })

      this.logger.info(`Subscribed to queue: ${name}`)
    } catch (error: any) {
      this.logger.error(`Failed to subscribe to queue: ${name}`, { error })
      throw error
    }
  }
}
