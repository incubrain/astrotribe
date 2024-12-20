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
import { BaseController } from '@core/base/base.controller'
import type { Prisma } from '@prisma/client'
import type { PrismaService } from '@core/services/prisma.service'
import type { ConfigService } from '@nestjs/config'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@core/types/pagination.types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { ContentSourcesService } from '../services/content-sources.service'

@Controller('content-sources')
@ApiTags('ContentSources')
export class ContentSourceController extends BaseController {
  constructor(
    protected readonly contentSourcesService: ContentSourcesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'content_sources', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all ContentSources' })
  async findAllContentSources(
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
  @ApiOperation({ summary: 'Get ContentSources by id' })
  async findOneContentSources(
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
  @ApiOperation({ summary: 'Create ContentSources' })
  async createContentSources(@Body() data: Prisma.content_sourcesCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ContentSources' })
  async updateContentSources(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.content_sourcesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentSources' })
  async removeContentSources(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
