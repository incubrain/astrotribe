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
import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { ContentTagsService } from '../services/content-tags.service'
import { BaseController } from '../../core/base/base.controller'

@Controller('content-tags')
@ApiTags('ContentTags')
export class ContentTagController extends BaseController {
  constructor(
    protected readonly contentTagsService: ContentTagsService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'content_tags', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all ContentTags' })
  async findAllContentTags(
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
  @ApiOperation({ summary: 'Get ContentTags by id' })
  async findOneContentTags(
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
  @ApiOperation({ summary: 'Create ContentTags' })
  async createContentTags(@Body() data: Prisma.content_tagsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ContentTags' })
  async updateContentTags(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.content_tagsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentTags' })
  async removeContentTags(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
