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
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'
import { EmbeddingReviewsService } from '../services/embedding-reviews.service'

import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { Prisma } from '@prisma/client'

@Controller('embedding-reviews')
@ApiTags('EmbeddingReviews')
export class EmbeddingReviewController extends BaseController {
  constructor(
    protected readonly embeddingReviewsService: EmbeddingReviewsService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('embedding_reviews')
  }

  @Get()
  @ApiOperation({ summary: 'Get all EmbeddingReviews' })
  async findAllEmbeddingReviews(
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
  @ApiOperation({ summary: 'Get EmbeddingReviews by id' })
  async findOneEmbeddingReviews(
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
  @ApiOperation({ summary: 'Create EmbeddingReviews' })
  async createEmbeddingReviews(@Body() data: Prisma.embedding_reviewsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update EmbeddingReviews' })
  async updateEmbeddingReviews(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.embedding_reviewsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete EmbeddingReviews' })
  async removeEmbeddingReviews(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
