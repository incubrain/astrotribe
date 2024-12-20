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
import { BaseController } from '@core/base/base.controller'
import type { PrismaService } from '@core/services/prisma.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { EmbeddingReviewsService } from '../services/embedding-reviews.service'

@Controller('embedding-reviews')
@ApiTags('EmbeddingReviews')
export class EmbeddingReviewController extends BaseController {
  constructor(
    protected readonly embeddingReviewsService: EmbeddingReviewsService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'embedding_reviews', config, paginationService, logger)
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
    } catch (error) {
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
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create EmbeddingReviews' })
  async createEmbeddingReviews(@Body() data: Prisma.embedding_reviewsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
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
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete EmbeddingReviews' })
  async removeEmbeddingReviews(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
