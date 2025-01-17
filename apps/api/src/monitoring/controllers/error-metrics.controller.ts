// src/monitoring/controllers/error-metrics.controller.ts
import { Controller, Get, Query, UseGuards, HttpException, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PermissionGuard } from '@core/guards/permission.guard'
import { ErrorMetricService } from '../services/error-metrics.service'
import { ApiBaseController } from '@core/base/base.controller'
import type { ErrorSeverity, ErrorType } from '@astronera/db'

@ApiBaseController('error-metrics')
@UseGuards(PermissionGuard)
export class ErrorMetricController {
  constructor(private readonly metricsService: ErrorMetricService) {}

  @Get('frequency')
  @ApiOperation({ summary: 'Get error frequency data' })
  async getErrorFrequency(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('service') serviceName?: string,
    @Query('type') errorType?: ErrorType,
    @Query('severity') severity?: ErrorSeverity,
  ) {
    try {
      return await this.metricsService.getErrorFrequency({
        startDate,
        endDate,
        serviceName,
        errorType,
        severity,
      })
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve error frequency',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Get error metrics' })
  async getErrorMetrics(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('service') serviceName?: string,
    @Query('type') errorType?: ErrorType,
  ) {
    try {
      return await this.metricsService.getErrorMetrics({
        startDate,
        endDate,
        serviceName,
        errorType,
      })
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve error metrics',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Get error stats data' })
  async getErrorStats(
    @Query('minExecTime') minExecTime?: number,
    @Query('topLevel') topLevel?: boolean,
  ) {
    try {
      return await this.metricsService.getErrorStats({
        minExecTime,
        topLevel,
      })
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve error stats',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get('trends')
  @ApiOperation({ summary: 'Get error trends over time' })
  async getErrorTrends(
    @Query('timeframe') timeframe: '1h' | '24h' | '7d' | '30d' = '24h',
    @Query('service') serviceName?: string,
  ) {
    try {
      return await this.metricsService.getErrorTrends(timeframe, serviceName)
    } catch (error: any) {
      throw new HttpException(
        error.message || 'Failed to retrieve error trends',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }
}
