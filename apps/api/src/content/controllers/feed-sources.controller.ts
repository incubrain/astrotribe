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
import { BaseController } from '../../core/base/base.controller'
import { Prisma } from '@prisma/client'
import { PrismaService } from '../../core/services/prisma.service'
import { ConfigService } from '@nestjs/config'
import { PaginationService } from '../../core/services/pagination.service'
import { PaginatedResponse, PaginatedQuery } from '../../core/types/pagination.types'
import { FeedSourceService } from '../services/feed-sources.service'
import { CustomLogger } from '../../core/logger/custom.logger'

@Controller('feed-sources')
@ApiTags('FeedSources')
export class FeedSourceController extends BaseController {
  constructor(
    protected readonly feedSourceService: FeedSourceService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'feed_sources', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all FeedSources' })
  async findAllFeedSources(
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
  @ApiOperation({ summary: 'Get FeedSources by id' })
  async findOneFeedSources(
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
  @ApiOperation({ summary: 'Create FeedSources' })
  async createFeedSources(@Body() data: Prisma.feed_sourcesCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update FeedSources' })
  async updateFeedSources(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.feed_sourcesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete FeedSources' })
  async removeFeedSources(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
