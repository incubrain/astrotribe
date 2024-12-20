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
import { ResearchEmbeddingsService } from '../services/research-embeddings.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('research-embeddings')
@ApiTags('ResearchEmbeddings')
export class ResearchEmbeddingController extends BaseController {
  constructor(
    protected readonly researchEmbeddingsService: ResearchEmbeddingsService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('research_embeddings')
  }

  @Get()
  @ApiOperation({ summary: 'Get all ResearchEmbeddings' })
  async findAllResearchEmbeddings(
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
  @ApiOperation({ summary: 'Get ResearchEmbeddings by id' })
  async findOneResearchEmbeddings(
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
  @ApiOperation({ summary: 'Create ResearchEmbeddings' })
  async createResearchEmbeddings(@Body() data: Prisma.research_embeddingsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update ResearchEmbeddings' })
  async updateResearchEmbeddings(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.research_embeddingsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete ResearchEmbeddings' })
  async removeResearchEmbeddings(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
