// src/modules/monitoring/controllers/agent-monitoring.controller.ts
import { Controller, Get, Param, Query, HttpException, HttpStatus, UseGuards } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'
import { PermissionGuard } from '@core/guards/permission.guard'
import { AgentService } from '../services/agent.service'
import { ApiBaseController } from '@core/base/base.controller'
import { PaginationService } from '@core/services/pagination.service'

interface AgentOverviewDto {
  name: string
  status: 'idle' | 'running' | 'failed'
  lastRunAt: string
  stats24h: {
    total: number
    success: number
    failed: number
    avgDuration: number
  }
  lastError?: {
    message: string
    timestamp: string
    type?: string
  }
}

@ApiBaseController('agents')
@UseGuards(PermissionGuard)
export class AgentController extends BaseController {
  constructor(
    protected readonly monitoringService: AgentService,
    protected readonly paginationService: PaginationService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly logger: CustomLogger,
  ) {
    super('AgentMetrics')
    this.logger.setDomain('monitoring')
  }

  @Get()
  @ApiOperation({ summary: 'Get overview of all agents' })
  async getAgentOverviews(): Promise<AgentOverviewDto[]> {
    try {
      return await this.monitoringService.getAgentOverviews()
    } catch (error: any) {
      this.logger.error('Failed to get agent overviews', { error })
      throw new HttpException(
        error.message || 'Failed to fetch agent data',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':name/latest')
  @ApiOperation({ summary: 'Get latest run data for an agent' })
  async getLatestRun(@Param('name') name: string) {
    try {
      return await this.monitoringService.getAgentLatestRun(name)
    } catch (error: any) {
      this.logger.error(`Failed to get latest run for agent: ${name}`, { error })
      throw new HttpException(
        error.message || 'Failed to fetch latest run',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':name/metrics')
  @ApiOperation({ summary: 'Get agent metrics for specified timeframe' })
  async getAgentMetrics(@Param('name') name: string, @Query('hours') hours: number = 24) {
    try {
      return await this.monitoringService.getAgentMetrics(name, hours)
    } catch (error: any) {
      this.logger.error(`Failed to get metrics for agent: ${name}`, { error })
      throw new HttpException(
        error.message || 'Failed to fetch metrics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
