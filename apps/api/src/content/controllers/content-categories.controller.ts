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
import { Prisma } from '@prisma/client'
import { PrismaService } from '@core/services/prisma.service'
import { ConfigService } from '@nestjs/config'
import { PaginationService } from '@core/services/pagination.service'
import { PaginatedResponse, PaginatedQuery } from '@core/types/pagination.types'
import { ContentCategoriesService } from '../services/content-categories.service'
import { CustomLogger } from '@core/logger/custom.logger'

@Controller('content-categories')
@ApiTags('ContentCategories')
export class ContentCategoryController extends BaseController {
  constructor(
    protected readonly contentCategoriesService: ContentCategoriesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    protected logger: CustomLogger,
  ) {
    super(prisma, 'content_categories', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all ContentCategories' })
  async findAllContentCategories(
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
  @ApiOperation({ summary: 'Get ContentCategories by id' })
  async findOneContentCategories(
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
  @ApiOperation({ summary: 'Create ContentCategories' })
  async createContentCategories(@Body() data: Prisma.content_categoriesCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ContentCategories' })
  async updateContentCategories(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.content_categoriesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ContentCategories' })
  async removeContentCategories(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
