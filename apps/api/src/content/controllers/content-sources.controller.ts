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
import { ContentSourcesService } from '../services/content-sources.service'

import { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('content-sources')
@ApiTags('ContentSources')
export class ContentSourceController extends BaseController {
  constructor(
    protected readonly contentSourcesService: ContentSourcesService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('content_sources')
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
    } catch (error: any) {
      return this.handleError(error: any)
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
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create ContentSources' })
  async createContentSources(@Body() data: Prisma.content_sourcesCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error: any)
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
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentSources' })
  async removeContentSources(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }
}
