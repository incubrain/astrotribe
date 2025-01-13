// src/modules/monitoring/services/agent-monitoring.service.ts
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@core/services/prisma.service'
import { CustomLogger } from '@core/logger/custom.logger'

export enum agent_status {
  idle = 'idle',
  running = 'running',
  failed = 'failed',
}

@Injectable()
export class AgentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: CustomLogger,
  ) {
    this.logger.setDomain('monitoring')
  }

  async getAgentOverviews() {
    // Get all unique agent names from metrics
    const agents = await this.prisma.AgentMetrics.groupBy({
      by: ['agent_name'],
    })

    const overviews = await Promise.all(
      agents.map(async ({ agent_name }) => {
        const [latestRun, metrics24h] = await Promise.all([
          this.cache.getLatestRun('agent', agent_name),
          this.get24HourMetrics(agent_name),
        ])

        return {
          name: agent_name,
          status: latestRun?.status || 'idle',
          lastRunAt: latestRun?.startTime ? new Date(latestRun.startTime).toISOString() : null,
          stats24h: metrics24h,
          lastError: latestRun?.error
            ? {
                message: latestRun.error.message,
                timestamp: new Date(latestRun.startTime).toISOString(),
                type: latestRun.error.type,
              }
            : undefined,
        }
      }),
    )

    return overviews
  }

  async getAgentLatestRun(name: string) {
    return this.cache.getLatestRun('agent', name)
  }

  async getAgentMetrics(name: string, hours: number) {
    const since = new Date()
    since.setHours(since.getHours() - hours)

    return this.prisma.AgentMetrics.findMany({
      where: {
        agent_name: name,
        execution_date: {
          gte: since,
        },
      },
      orderBy: {
        execution_date: 'desc',
      },
    })
  }

  private async get24HourMetrics(agentName: string) {
    const since = new Date()
    since.setHours(since.getHours() - 24)

    const metrics = await this.prisma.AgentMetrics.findMany({
      where: {
        agent_name: agentName,
        execution_date: {
          gte: since,
        },
      },
    })

    const total = metrics.length
    const success = metrics.filter((m) => m.status === 'success').length
    const failed = total - success
    const avgDuration = metrics.reduce((sum, m) => sum + m.duration_ms, 0) / total

    return {
      total,
      success,
      failed,
      avgDuration,
    }
  }
}
