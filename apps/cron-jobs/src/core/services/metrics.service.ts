import { ErrorType } from '@astronera/db'
import { CustomLogger } from './logger.service'
import { PrismaService } from './prisma.service'
import { EventService } from './event.service'
import { JobExecutionMetrics, CircuitBreakerMetrics, JobMetrics } from '@types'

// src/infrastructure/services/metrics/metrics.service.ts

export class MetricsService {
  constructor(
    private readonly logger: CustomLogger,
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {
    this.logger.setDomain('metrics')
    this.setupEventListeners()
  }

  private setupEventListeners() {
    this.eventService.on('job.started', async (jobName: string, jobId: string, metadata?: any) => {
      await this.trackJobStart(jobName, jobId, metadata)
    })

    this.eventService.on('job.completed', async (jobName: string, jobId: string, result: any) => {
      const duration = await this.calculateJobDuration(jobId)
      await this.trackJobSuccess(jobName, jobId, duration, result)
    })

    this.eventService.on(
      'job.failed',
      async (jobName: string, jobId: string, error: Error, metadata?: any) => {
        const duration = await this.calculateJobDuration(jobId)
        await this.trackJobFailure(jobName, jobId, duration, error, metadata)
      },
    )

    this.eventService.on('circuit-breaker.state-changed', async (data) => {
      await this.trackCircuitBreakerChange(data.jobName, {
        jobName: data.jobName,
        state: data.newState,
        failures: data.failures,
        lastFailure: new Date(),
        timeInCurrentState: 0,
        lastSuccess: data.lastSuccess,
        recoveryAttempts: data.recoveryAttempts || 0,
      })
    })

    // Performance monitoring events
    this.eventService.on(
      'job.performance',
      async (jobName: string, jobId: string, metrics: any) => {
        await this.trackPerformanceMetrics(jobName, jobId, metrics)
      },
    )
  }

  async trackQueueStats(queueName: string, stats: QueueStats) {
    try {
      const data = {
        created_count: Math.max(0, Math.floor(Number(stats.created))),
        completed_count: Math.max(0, Math.floor(Number(stats.completed))),
        failed_count: Math.max(0, Math.floor(Number(stats.failed))),
        retry_count: Math.max(0, Math.floor(Number(stats.retry))),
        active_count: Math.max(0, Math.floor(Number(stats.active))),
      }

      await this.prisma.jobQueueStats.upsert({
        where: { queue_name: queueName },
        create: {
          queue_name: queueName,
          ...data,
        },
        update: data,
      })
    } catch (error: any) {
      this.logger.error('Failed to track queue stats', { error })
    }
  }

  // Add method to get historical stats
  async getQueueStatsHistory(queueName: string, hours: number = 24): Promise<any[]> {
    return this.prisma.jobQueueStats.findMany({
      where: {
        queue_name: queueName,
        updated_at: {
          gte: new Date(Date.now() - hours * 60 * 60 * 1000),
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    })
  }

  async trackJobMetrics(jobName: string, jobId: string, metrics: JobMetricsData) {
    try {
      const duration = metrics.duration ? Math.max(0, Math.floor(metrics.duration)) : undefined

      await this.prisma.jobMetrics.upsert({
        where: {
          id: metrics.jobId,
          job_name: metrics.jobName,
        },
        create: {
          job_id: jobId,
          job_name: jobName,
          status: metrics.status,
          duration,
          items_processed: metrics.itemsProcessed,
          metadata: metrics.metadata,
          performance: metrics.performance,
        },
        update: {
          status: metrics.status,
          duration,
          items_processed: metrics.itemsProcessed,
          metadata: metrics.metadata,
          performance: metrics.performance,
        },
      })
    } catch (error: any) {
      this.logger.error('Failed to track job metrics', { error })
    }
  }

  async trackCircuitBreakerChange(jobName: string, metrics: CircuitBreakerMetrics) {
    this.logger.debug(`Tracking circuit breaker change: ${jobName}`, metrics)
    try {
      await this.prisma.circuitBreakerStates.upsert({
        where: { job_name: jobName },
        create: {
          job_name: jobName,
          status: metrics.status,
          failure_count: metrics.failureCount,
          last_failure: metrics.lastFailure,
          reset_timeout: metrics.resetTimeout,
        },
        update: {
          status: metrics.status,
          failure_count: metrics.failureCount,
          last_failure: metrics.lastFailure,
          reset_timeout: metrics.resetTimeout,
        },
      })
    } catch (error: any) {
      this.logger.error('Failed to track circuit breaker change', { error })
    }
  }

  async trackPerformanceMetrics(jobName: string, jobId: string, metrics: any) {
    try {
      await this.prisma.jobMetrics.update({
        where: {
          id: jobId,
        },
        data: {
          performance: metrics,
        },
      })
    } catch (error: any) {
      this.logger.error('Failed to track performance metrics', { error })
    }
  }

  async getJobPerformanceStats(jobName: string, period: 'hour' | 'day' | 'week' | 'month') {
    const startDate = new Date()
    switch (period) {
      case 'hour':
        startDate.setHours(startDate.getHours() - 1)
        break
      case 'day':
        startDate.setDate(startDate.getDate() - 1)
        break
      case 'week':
        startDate.setDate(startDate.getDate() - 7)
        break
      case 'month':
        startDate.setMonth(startDate.getMonth() - 1)
        break
    }

    try {
      const metrics = await this.prisma.jobMetrics.findMany({
        where: {
          job_name: jobName,
          started_at: { gte: startDate },
        },
        orderBy: { started_at: 'desc' },
      })

      const stats = {
        totalRuns: metrics.length,
        successRate: this.calculateSuccessRate(metrics),
        avgDuration: this.calculateAverageDuration(metrics),
        avgItemsProcessed: this.calculateAverageItemsProcessed(metrics),
        performanceMetrics: this.aggregatePerformanceMetrics(metrics),
        errorRate: this.calculateErrorRate(metrics),
        timeoutRate: this.calculateTimeoutRate(metrics),
      }

      return stats
    } catch (error: any) {
      await this.logError('Failed to get job performance stats', error, { jobName, period })
      throw error
    }
  }

  private calculateSuccessRate(metrics: any[]): number {
    const successful = metrics.filter((m) => m.status === 'completed').length
    return (successful / metrics.length) * 100
  }

  private calculateAverageDuration(metrics: any[]): number {
    const durations = metrics.map((m) => m.duration_ms).filter(Boolean)
    return durations.length ? durations.reduce((a, b) => a + b, 0) / durations.length : 0
  }

  private calculateAverageItemsProcessed(metrics: any[]): number {
    const items = metrics.map((m) => m.items_processed).filter(Boolean)
    return items.length ? items.reduce((a, b) => a + b, 0) / items.length : 0
  }

  private calculateErrorRate(metrics: any[]): number {
    const errors = metrics.filter((m) => m.status === 'failed').length
    return (errors / metrics.length) * 100
  }

  private calculateTimeoutRate(metrics: any[]): number {
    const timeouts = metrics.filter(
      (m) => m.error_message?.includes('timeout') || m.error_message?.includes('timed out'),
    ).length
    return (timeouts / metrics.length) * 100
  }

  private aggregatePerformanceMetrics(metrics: any[]) {
    const performanceData = metrics.map((m) => m.metadata?.performance).filter(Boolean)

    if (!performanceData.length) return null

    return {
      avgItemsPerSecond: this.average(performanceData.map((p) => p.itemsPerSecond)),
      avgProcessingTime: this.average(performanceData.map((p) => p.avgProcessingTime)),
      avgPeakMemoryUsage: this.average(performanceData.map((p) => p.peakMemoryUsage)),
    }
  }

  private average(values: number[]): number {
    return values.reduce((a, b) => a + b, 0) / values.length
  }

  private async calculateJobDuration(jobId: string): Promise<number> {
    const metric = await this.prisma.jobMetrics.findFirst({
      where: { job_id: jobId, status: 'active' },
    })
    return metric ? Date.now() - metric.started_at.getTime() : 0
  }

  async trackJobStart(jobName: string, jobId: string, metadata?: Record<string, any>) {
    this.logger.debug(`Tracking job start: ${jobName}`, { jobId, metadata })
    try {
      await this.prisma.jobMetrics.create({
        data: {
          job_id: jobId,
          job_name: jobName,
          status: 'active',
          started_at: new Date(),
          metadata: metadata || {},
        },
      })
    } catch (error: any) {
      await this.logError('Failed to track job start', error, {
        jobName,
        jobId,
        metadata,
      })
    }
  }

  async trackJobSuccess(
    jobName: string,
    jobId: string,
    duration: number,
    result: {
      itemsProcessed?: number
      metadata?: Record<string, any>
      performance?: {
        itemsPerSecond: number
        avgProcessingTime: number
        peakMemoryUsage: number
      }
    },
  ) {
    this.logger.debug(`Tracking job success: ${jobName}`, { jobId, duration, result })
    try {
      await this.prisma.jobMetrics.updateMany({
        where: {
          job_name: jobName,
          job_id: jobId,
          status: 'active',
        },
        data: {
          status: 'completed',
          duration_ms: duration,
          items_processed: result?.itemsProcessed,
          metadata: {
            ...result?.metadata,
            performance: result?.performance,
          },
          completed_at: new Date(),
        },
      })
    } catch (error: any) {
      await this.logError('Failed to track job success', error, {
        jobName,
        jobId,
        duration,
        result,
      })
    }
  }

  async trackJobFailure(
    jobName: string,
    jobId: string,
    duration: number,
    error: Error,
    metadata?: Record<string, any>,
  ) {
    this.logger.debug(`Tracking job failure: ${jobName}`, { jobId, duration, error, metadata })
    try {
      await this.prisma.jobMetrics.updateMany({
        where: {
          job_name: jobName,
          job_id: jobId,
          status: 'active',
        },
        data: {
          status: 'failed',
          duration_ms: duration,
          error_message: error.message,
          error_stack: error.stack,
          metadata: metadata || {},
          failed_at: new Date(),
        },
      })

      await this.logError('Job failed', error, {
        jobName,
        jobId,
        duration,
        metadata,
      })
    } catch (logError: any) {
      await this.logError('Failed to track job failure', logError, {
        jobName,
        jobId,
        duration,
        originalError: error.message,
        metadata,
      })
    }
  }

  async trackJobCompletion(
    jobName: string,
    jobId: string,
    metrics: JobMetrics & { metadata?: Record<string, any> },
  ) {
    this.logger.debug(`Tracking job completion: ${jobName}`, { jobId, metrics })
    if (metrics.success) {
      await this.trackJobSuccess(jobName, jobId, metrics.duration, {
        itemsProcessed: metrics.itemsProcessed,
        metadata: metrics.metadata,
        performance: metrics.performance,
      })
    } else {
      await this.trackJobFailure(jobName, jobId, metrics.duration, metrics.error!, metrics.metadata)
    }
  }

  private async logError(message: string, error: Error, context: Record<string, any> = {}) {
    try {
      await this.prisma.error_logs.create({
        data: {
          service_name: 'jobs',
          error_type: ErrorType.DATABASE_ERROR,
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
}
