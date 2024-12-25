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
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'
import { ConfigService } from '@nestjs/config'
import { ContentTagsService } from '../services/content-tags.service'

import type { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('content-tags')
@ApiTags('ContentTags')
export class ContentTagController extends BaseController {
  constructor(
    protected readonly contentTagsService: ContentTagsService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('content_tags')
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
    } catch (error: any) {
      return this.handleError(error: any)
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
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create ContentTags' })
  async createContentTags(@Body() data: Prisma.content_tagsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error: any)
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
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentTags' })
  async removeContentTags(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }
}
