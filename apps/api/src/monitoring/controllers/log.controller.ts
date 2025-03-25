// src/monitoring/controllers/logs.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  HttpException,
  HttpStatus,
  Inject,
} from '@nestjs/common'
import { MessagePattern } from '@nestjs/microservices'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { ErrorLogs } from '@astronera/db'
import { BaseController } from '@core/base/base.controller'
import { PermissionGuard } from '@core/guards/permission.guard'
import { ApiKeyGuard } from '@core/guards/api-key.guard'
import { LogService } from '../services/log.service'
import { ApiBaseController } from '@core/base/base.controller'
import { ApiPaginatedResponse } from '@core/decorators/api.decorator'
import { Service } from '@core/decorators/service.decorator'
import type { LogEntry } from '@ib/cache'
import type { ErrorLogEntry } from '@incubrain/logger'

@ApiBaseController('logs')
@UseGuards(PermissionGuard)
export class LogController extends BaseController {
  constructor(
    protected readonly logService: LogService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('ErrorLogs')
    this.logger.setDomain('monitoring')
  }

  @Get('patterns')
  @ApiOperation({ summary: 'Get error patterns' })
  async getErrorPatterns() {
    try {
      return await this.logService.getErrorPatterns()
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve error patterns',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @ApiPaginatedResponse({})
  @Get()
  async getLogs(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('service') service?: string,
    @Query('severity') severity?: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 50,
  ) {
    // For historical logs, get from Postgres
    if (from && to) {
      return this.logService.getHistoricalLogs({
        from: new Date(from),
        to: new Date(to),
        service,
        severity,
        page,
        pageSize,
      })
    }

    // For recent logs (last 24h), get from Redis
    return this.logService.getRecentLogs({
      service,
      severity,
      page,
      pageSize,
    })
  }

  @Post('process')
  @Service()
  @ApiOperation({ summary: 'Process new log entry' })
  async processLog(@Body() log: LogEntry) {
    try {
      const errorLog: ErrorLogEntry = {
        ...log,
        id: '', // provide appropriate value
        service_name: '', // provide appropriate value
        severity: '', // provide appropriate value
        environment: '', // provide appropriate value
        created_at: new Date().toISOString(), // provide appropriate value
      }
      return await this.logService.processLog(errorLog)
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to process log',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get log statistics' })
  async getLogStats(@Query('hours') hours?: number) {
    try {
      return await this.logService.getLogStats(hours)
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve log statistics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
