// controller.ejs template
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
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import type { Prisma } from '@prisma/client'
import type { PrismaService } from '@core/services/prisma.service'
import type { ConfigService } from '@nestjs/config'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@core/types/pagination.types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { ContentSourceVisitService } from '../services/content-source-visits.service'
import { BaseController } from '../../core/base/base.controller'

@Controller('content-source-visits')
@ApiTags('ContentSourceVisits')
export class ContentSourceVisitController extends BaseController {
  constructor(
    protected readonly contentSourceVisitService: ContentSourceVisitService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'content_source_visits', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all ContentSourceVisits' })
  async findAllContentSourceVisits(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      return await super.findAll(query)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ContentSourceVisits by id' })
  async findOneContentSourceVisits(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string[],
  ) {
    try {
      return await super.findOne(id, include)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create ContentSourceVisits' })
  async createContentSourceVisits(@Body() data: Prisma.content_source_visitsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ContentSourceVisits' })
  async updateContentSourceVisits(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.content_source_visitsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentSourceVisits' })
  async removeContentSourceVisits(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
