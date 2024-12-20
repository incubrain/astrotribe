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
import type { ConfigService } from '@nestjs/config'
import type { Prisma } from '@prisma/client'

import { BaseController } from '@core/base/base.controller'
import type { PrismaService } from '@core/services/prisma.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { FeedCategoriesService } from '../services/feed-categories.service'

@Controller('feed-categories')
@ApiTags('FeedCategories')
export class FeedCategoryController extends BaseController {
  constructor(
    protected readonly feedCategoriesService: FeedCategoriesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'feed_categories', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all FeedCategories' })
  async findAllFeedCategories(
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
  @ApiOperation({ summary: 'Get FeedCategories by id' })
  async findOneFeedCategories(
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
  @ApiOperation({ summary: 'Create FeedCategories' })
  async createFeedCategories(@Body() data: Prisma.feed_categoriesCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update FeedCategories' })
  async updateFeedCategories(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.feed_categoriesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete FeedCategories' })
  async removeFeedCategories(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
