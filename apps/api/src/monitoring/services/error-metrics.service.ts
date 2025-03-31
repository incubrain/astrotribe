// src/monitoring/services/error-metrics.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@core/services/prisma.service'
import { CustomLogger } from '@core/logger/custom.logger'
import type { ErrorSeverity, ErrorType } from '@astronera/db'

interface TimeRange {
  startDate?: string
  endDate?: string
}

interface ErrorQueryParams extends TimeRange {
  serviceName?: string
  errorType?: ErrorType
  severity?: ErrorSeverity
}

@Injectable()
export class ErrorMetricService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setDomain('monitoring')
  }

  async getErrorFrequency(params: ErrorQueryParams) {
    try {
      const { startDate, endDate, serviceName, errorType, severity } = params

      const where = {
        ...(serviceName && { service_name: serviceName }),
        ...(errorType && { error_type: errorType }),
        ...(severity && { severity }),
        ...(startDate &&
          endDate && {
            time_bucket: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      }

      const frequency = await this.prisma.error_frequency.findMany({
        where,
        orderBy: { time_bucket: 'desc' },
      })

      return {
        data: frequency,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get error frequency', { error })
      throw error
    }
  }

  async getErrorMetrics(params: ErrorQueryParams) {
    try {
      const { startDate, endDate, serviceName, errorType } = params

      const where = {
        ...(serviceName && { service_name: serviceName }),
        ...(errorType && { error_type: errorType }),
        ...(startDate &&
          endDate && {
            time_bucket: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          }),
      }

      const [metrics, totalErrors] = await Promise.all([
        this.prisma.error_metrics.findMany({
          where,
          orderBy: { time_bucket: 'desc' },
        }),
        this.prisma.error_metrics.aggregate({
          where,
          _sum: { error_count: true },
        }),
      ])

      return {
        data: metrics,
        total: totalErrors._sum.error_count || 0,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get error metrics', { error })
      throw error
    }
  }

  async getErrorStats({ minExecTime, topLevel }: { minExecTime?: number; topLevel?: boolean }) {
    try {
      const where = {
        ...(minExecTime && { mean_exec_time: { gte: minExecTime } }),
        ...(topLevel !== undefined && { toplevel: topLevel }),
      }

      const stats = await this.prisma.error_stats.findMany({
        where,
        orderBy: { mean_exec_time: 'desc' },
      })

      return {
        data: stats,
        timestamp: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get error stats', { error })
      throw error
    }
  }

  async getErrorTrends(timeframe: '1h' | '24h' | '7d' | '30d', serviceName?: string) {
    try {
      const intervals = {
        '1h': { hours: 1, interval: 'minute' },
        '24h': { hours: 24, interval: 'hour' },
        '7d': { days: 7, interval: 'day' },
        '30d': { days: 30, interval: 'day' },
      }

      const { hours, days } = intervals[timeframe] as {
        hours?: number
        days?: number
        interval: string
      }
      const startDate = new Date()
      if (hours) startDate.setHours(startDate.getHours() - hours)
      if (days) startDate.setDate(startDate.getDate() - days)

      const trends = await this.prisma.error_metrics.groupBy({
        by: ['severity', 'time_bucket'],
        where: {
          time_bucket: { gte: startDate },
          ...(serviceName && { service_name: serviceName }),
        },
        _sum: { error_count: true },
        orderBy: { time_bucket: 'asc' },
      })

      // Group by severity and create time series
      const grouped = trends.reduce((acc, curr) => {
        const severity = curr.severity
        if (!acc[severity]) acc[severity] = []

        acc[severity].push({
          timestamp: curr.time_bucket,
          count: curr._sum.error_count || 0,
        })

        return acc
      }, {})

      return {
        data: grouped,
        timeframe,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get error trends', { error })
      throw error
    }
  }
}
