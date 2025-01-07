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
  import { PermissionGuard } from '@core/guards/permission.guard'
  import { Prisma } from '@prisma/client'
  import { ConfigService } from '@nestjs/config'
  import { PrismaService } from '@core/services/prisma.service'
  import { PaginationService } from '@core/services/pagination.service'
  import { CustomLogger } from '@core/logger/custom.logger'
  import { BaseController, ApiBaseController } from '@core/base/base.controller'
  import { PaginatedQuery } from '@types'
  import { JobConfigService } from '../services/job-config.service'
  
  @ApiBaseController('job-configs')
  @UseGuards(PermissionGuard)
  @Controller()
  export class JobConfigController extends BaseController {
    constructor(
      protected readonly jobConfigService: JobConfigService,
      protected readonly prisma: PrismaService,
      protected readonly config: ConfigService,
      protected readonly paginationService: PaginationService,
      protected readonly logger: CustomLogger,
    ) {
      // Match the Prisma model name you intend to use
      super('job_configs')
    }
  
    @Get()
    @ApiOperation({ summary: 'Get all job configs (cron-jobs)' })
    async getAll(@Query() query: PaginatedQuery) {
      try {
        // If you want fully customized retrieval, call a custom service method:
        // return this.jobConfigsService.getAllJobConfigs(query)
        // Or, use the base controller’s `findAll` for quick paging/filters:
        return await this.findAll(query)
      } catch (error: any) {
        throw new HttpException(
          error.message || 'An error occurred',
          error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        )
      }
    }
  
    @Get(':id')
    @ApiOperation({ summary: 'Get a single job config by ID' })
    async findOneJobConfig(
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
    @ApiOperation({ summary: 'Create a new job config (cron-job)' })
    async createJobConfig(@Body() data: Prisma.job_configsCreateInput) {
      try {
        return await this.create(data)
      } catch (error: any) {
        throw this.handleError(error)
      }
    }
  
    @Put(':id')
    @ApiOperation({ summary: 'Update an existing job config' })
    async updateJobConfig(
      @Param('id', ParseUUIDPipe) id: string,
      @Body() data: Prisma.job_configsUpdateInput,
    ) {
      try {
        return await this.update(id, data)
      } catch (error: any) {
        throw this.handleError(error)
      }
    }
  
    @Delete(':id')
    @ApiOperation({ summary: 'Delete a job config' })
    async removeJobConfig(@Param('id', ParseUUIDPipe) id: string) {
      try {
        return await this.remove(id)
      } catch (error: any) {
        throw this.handleError(error)
      }
    }
  }
