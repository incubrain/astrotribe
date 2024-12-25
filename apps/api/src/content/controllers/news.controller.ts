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
import { NewsService } from '../services/news.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('news')
@ApiTags('News')
export class NewsController extends BaseController {
  constructor(
    protected readonly newsService: NewsService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('news')
  }

  @Get()
  @ApiOperation({ summary: 'Get all News' })
  async findAllNews(
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
  @ApiOperation({ summary: 'Get News by id' })
  async findOneNews(@Param('id', ParseUUIDPipe) id: string, @Query('include') include?: string[]) {
    try {
      return await super.findOne(id, include)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create News' })
  async createNews(@Body() data: Prisma.newsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update News' })
  async updateNews(@Param('id', ParseUUIDPipe) id: string, @Body() data: Prisma.newsUpdateInput) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete News' })
  async removeNews(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error: any)
    }
  }
}
