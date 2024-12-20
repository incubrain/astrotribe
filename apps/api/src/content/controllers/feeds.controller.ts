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
import type { ConfigService } from '@nestjs/config'

import { BaseController } from '../../core/base/base.controller'
import type { PrismaService } from '../../core/services/prisma.service'
import type { PaginationService } from '../../core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { FeedsService } from '../services/feeds.service'
import type { CustomLogger } from '../../core/logger/custom.logger'

@Controller('feeds')
@ApiTags('Feeds')
export class FeedController extends BaseController {
  constructor(
    protected readonly feedsService: FeedsService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'feeds', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all Feeds' })
  async findAllFeeds(
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
  @ApiOperation({ summary: 'Get Feeds by id' })
  async findOneFeeds(@Param('id', ParseUUIDPipe) id: string, @Query('include') include?: string[]) {
    try {
      return await super.findOne(id, include)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Feeds' })
  async createFeeds(@Body() data: Prisma.feedsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Feeds' })
  async updateFeeds(@Param('id', ParseUUIDPipe) id: string, @Body() data: Prisma.feedsUpdateInput) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Feeds' })
  async removeFeeds(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
