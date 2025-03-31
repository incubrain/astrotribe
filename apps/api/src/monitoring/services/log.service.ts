// src/monitoring/services/log.service.ts
import { Injectable, Inject, OnModuleInit } from '@nestjs/common'
import { Redis } from 'ioredis'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { Cron } from '@nestjs/schedule'
import { LogGateway } from '../gateways/log.gateway'
import type { ErrorLogEntry } from '@incubrain/logger'
import type { PaginatedQuery } from '@types'

@Injectable()
export class LogService implements OnModuleInit {
  private readonly LOG_KEY_PREFIX = 'logs:'
  private readonly RETENTION_HOURS = 24
  @Inject(LogGateway)
  private readonly logGateway: LogGateway

  constructor(
    @Inject('REDIS_CACHE') private readonly redis: Redis,
    private readonly prisma: PrismaService,
    private readonly paginationService: PaginationService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setDomain('monitoring')
  }

  async onModuleInit() {
    await this.cleanupOldLogs()
  }

  async getRecentLogs(
    query: PaginatedQuery & {
      hours?: number
      level?: 'error' | 'warn' | 'info'
      service?: string
    },
  ): Promise<any> {
    try {
      const { skip, take } = this.paginationService.getSkipTake(query)
      const hours = query.hours || this.RETENTION_HOURS

      // Get keys from Redis
      const keys = await this.redis.keys(`${this.LOG_KEY_PREFIX}*`)
      if (!keys.length)
        return {
          data: [],
          meta: this.paginationService.getPaginationMeta(0, query),
          created_at: new Date().toISOString(),
        }

      // Get all logs
      const pipeline = this.redis.pipeline()
      keys.forEach((key) => pipeline.hgetall(key))
      const results: any = await pipeline.exec()
      if (!results) return []

      // Filter and transform logs
      let logs = results
        .map(([err, data]) => {
          if (err || !data) return null
          return {
            ...Object.values(data),
            metadata: data.metadata ? JSON.parse(data.metadata) : {},
            created_at: parseInt(data.created_at),
          }
        })
        .filter(Boolean)
        .filter((log) => {
          const cutoff = Date.now() - hours * 3600000
          return (
            log.created_at >= cutoff &&
            (!query.level || log.level === query.level) &&
            (!query.service || log.service === query.service)
          )
        })
        .sort((a, b) => b.created_at - a.created_at)

      const total = logs.length
      logs = logs.slice(skip, skip + take)

      return {
        data: logs,
        meta: this.paginationService.getPaginationMeta(total, query),
        created_at: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get recent logs', { error })
      throw error
    }
  }

  async processLog(log: ErrorLogEntry): Promise<void> {
    try {
      const logKey = `${this.LOG_KEY_PREFIX}${log.created_at}`

      console.log('Processing log', logKey, log)

      await this.redis
        .multi()
        .hset(logKey, {
          ...log,
          metadata: JSON.stringify(log.metadata),
        })
        .expire(logKey, this.RETENTION_HOURS * 3600)
        .exec()

      await this.logGateway.broadcastLog(log)
    } catch (error: any) {
      this.logger.error('Failed to process log', { error })
      throw error
    }
  }

  async getLogStats(hours: number = 24) {
    try {
      const keys = await this.redis.keys(`${this.LOG_KEY_PREFIX}*`)
      const pipeline = this.redis.pipeline()
      keys.forEach((key) => pipeline.hgetall(key))
      const results = await pipeline.exec()

      const cutoff = Date.now() - hours * 3600000
      const stats = {
        total: 0,
        byLevel: {} as Record<string, number>,
        byService: {} as Record<string, number>,
        timeRange: {
          start: new Date(cutoff).toISOString(),
          end: new Date().toISOString(),
        },
      }

      results?.forEach(([err, data]: [err: any, data: any]) => {
        if (err || !data) return
        const created_at = parseInt(data.created_at)
        if (created_at < cutoff) return

        stats.total++
        stats.byLevel[data.level] = (stats.byLevel[data.level] || 0) + 1
        stats.byService[data.service] = (stats.byService[data.service] || 0) + 1
      })

      return stats
    } catch (error: any) {
      this.logger.error('Failed to get log stats', { error })
      throw error
    }
  }

  @Cron('0 * * * *')
  async batchProcessLogs(): Promise<void> {
    try {
      const hourAgo = Date.now() - 3600000
      const keys = await this.redis.keys(`${this.LOG_KEY_PREFIX}*`)

      const logsToProcess: any = await Promise.all(
        keys.map(async (key) => {
          const log = await this.redis.hgetall(key)
          return { key, ...log }
        }),
      )

      // Group logs by service and level
      const groupedLogs = logsToProcess.reduce((acc, log) => {
        const key = `${log.service}_${log.level}`
        if (!acc[key]) acc[key] = []
        acc[key].push(log)
        return acc
      }, {})

      // Store in PostgreSQL
      await Promise.all(
        (Object.values(groupedLogs) as any[][]).map(async (logs: any[]) => {
          await this.prisma.errorLogs.createMany({
            data: logs.map((log) => ({
              service_name: log.service,
              severity: this.mapLogLevelToSeverity(log.level),
              message: log.message,
              metadata: log.metadata ? JSON.parse(log.metadata) : {},
              created_at: new Date(parseInt(log.created_at)),
              environment: process.env.NODE_ENV || 'development',
              error_type: log.error_type || 'unknown', // Add this line
            })),
          })
        }),
      )

      // Cleanup processed logs
      await Promise.all(logsToProcess.map((log) => this.redis.del(log.key)))
    } catch (error: any) {
      this.logger.error('Failed to batch process logs', { error })
      throw error
    }
  }

  private async cleanupOldLogs(): Promise<void> {
    try {
      const retentionTime = Date.now() - this.RETENTION_HOURS * 3600000
      const keys = await this.redis.keys(`${this.LOG_KEY_PREFIX}*`)

      for (const key of keys) {
        const keyType = await this.redis.type(key)
        if (keyType !== 'hash') {
          this.logger.warn(`Deleting key ${key} with unexpected type: ${keyType}`)
          await this.redis.del(key)
          continue
        }
        const log = await this.redis.hgetall(key)
        if (parseInt(log.created_at) < retentionTime) {
          await this.redis.del(key)
        }
      }
    } catch (error: any) {
      this.logger.error('Failed to cleanup old logs', { error })
    }
  }

  private mapLogLevelToSeverity(level: string): 'low' | 'medium' | 'high' | 'critical' {
    switch (level) {
      case 'error':
        return 'critical'
      case 'warn':
        return 'high'
      case 'info':
        return 'medium'
      default:
        return 'low'
    }
  }

  async getHistoricalLogs({
    from,
    to,
    service,
    severity,
    page,
    pageSize,
  }: {
    from: Date
    to: Date
    service?: string
    severity?: string
    page: number
    pageSize: number
  }) {
    const { skip, take } = this.paginationService.getSkipTake({ page, pageSize })

    const [logs, total] = await Promise.all([
      this.prisma.errorLogs.findMany({
        where: {
          created_at: {
            gte: from,
            lte: to,
          },
          ...(service && { service_name: service }),
          ...(severity && { severity: severity as any }),
        },
        orderBy: { created_at: 'desc' },
        skip,
        take,
      }),
      this.prisma.errorLogs.count({
        where: {
          created_at: {
            gte: from,
            lte: to,
          },
          ...(service && { service_name: service }),
          ...(severity && { severity: severity as any }),
        },
      }),
    ])

    return {
      data: logs,
      meta: this.paginationService.getPaginationMeta(total, { page, pageSize }),
      created_at: new Date().toISOString(),
    }
  }

  async getErrorPatterns() {
    try {
      const patterns = await this.prisma.errorLogs.groupBy({
        by: ['error_hash', 'error_pattern'],
        where: {
          is_new_pattern: true,
          created_at: {
            gte: new Date(Date.now() - this.RETENTION_HOURS * 3600000),
          },
        },
        _count: {
          error_hash: true,
        },
        orderBy: {
          _count: {
            error_hash: 'desc',
          },
        },
      })

      return {
        patterns: await Promise.all(
          patterns.map(async (pattern) => {
            const example = await this.prisma.errorLogs.findFirst({
              where: { error_hash: pattern.error_hash },
              select: {
                message: true,
                stack_trace: true,
                service_name: true,
                domain: true,
                created_at: true,
              },
            })

            return {
              ...pattern,
              count: pattern._count.error_hash,
              example,
            }
          }),
        ),
        created_at: new Date().toISOString(),
      }
    } catch (error: any) {
      this.logger.error('Failed to get error patterns', { error })
      throw error
    }
  }
}
