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
import { ConfigService } from '@nestjs/config'
import { FeedCategoriesService } from '../services/feed-categories.service'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@astronera/db'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('feed-categories')
@ApiTags('FeedCategories')
export class FeedCategoryController extends BaseController {
  constructor(
    protected readonly feedCategoriesService: FeedCategoriesService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('FeedCategories')
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
    } catch (error: any) {
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
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create FeedCategories' })
  async createFeedCategories(@Body() data: Prisma.FeedCategoriesCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update FeedCategories' })
  async updateFeedCategories(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.FeedCategoriesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete FeedCategories' })
  async removeFeedCategories(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
