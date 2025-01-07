import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { PermissionGuard } from '@core/guards/permission.guard'
import { BaseController, ApiBaseController } from '@core/base/base.controller'
import { JobMetricService } from '../services/job-metric.service'
import { Prisma } from '@prisma/client'
import { PaginatedQuery } from '@types'

@ApiBaseController('job-metrics')
@UseGuards(PermissionGuard)
@Controller()
export class JobMetricController extends BaseController {
  constructor(
    protected readonly jobMetricService: JobMetricService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('job_metrics')
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all job metrics' })
  async getAll(@Query() query: PaginatedQuery) {
    try {
      // If you need a simple paginated list:
      return await this.findAll(query)
      // Or for custom logic, call service methods, e.g.:
      // return await this.jobMetricService.findMetricsByJobName('my-job')
    } catch (error: any) {
      throw new HttpException(
        error.message || 'An error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieve a single job metric by ID' })
  async findOneJobMetric(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string[],
  ) {
    try {
      return await this.findOne(id, include)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create a new job metric record' })
  async createJobMetric(@Body() data: Prisma.job_metricsCreateInput) {
    try {
      return await this.create(data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a job metric record' })
  async updateJobMetric(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.job_metricsUpdateInput,
  ) {
    try {
      return await this.update(id, data)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a job metric record' })
  async removeJobMetric(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await this.remove(id)
    } catch (error: any) {
      throw this.handleError(error)
    }
  }
}
