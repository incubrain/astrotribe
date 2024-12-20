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
  Inject,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import type { Prisma } from '@prisma/client'
import type { ConfigService } from '@nestjs/config'

import { BaseController } from '@core/base/base.controller'
import type { PrismaService } from '@core/services/prisma.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@core/types/pagination.types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { CategoriesService } from '../services/categories.service'

@Controller('categories')
@ApiTags('Categories')
export class CategoryController extends BaseController {
  constructor(
    protected readonly categoriesService: CategoriesService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'categories', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all Categories' })
  async findAllCategories(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all categories')
      return super.findAll(query)
    } catch (error) {
      this.logger.error('Failed to fetch categories', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Categories by id' })
  async findOneCategories(
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
  @ApiOperation({ summary: 'Create Categories' })
  async createCategories(@Body() data: Prisma.categoriesCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Categories' })
  async updateCategories(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.categoriesUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Categories' })
  async removeCategories(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
