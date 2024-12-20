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
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { CustomLogger } from '@core/logger/custom.logger'
import type { ResearchService } from '../services/research.service'

@Controller('research')
@ApiTags('Research')
export class ResearchController extends BaseController {
  constructor(
    protected readonly researchService: ResearchService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'research', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all Research' })
  async findAllResearch(
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
  @ApiOperation({ summary: 'Get Research by id' })
  async findOneResearch(
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
  @ApiOperation({ summary: 'Create Research' })
  async createResearch(@Body() data: Prisma.researchCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Research' })
  async updateResearch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.researchUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Research' })
  async removeResearch(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}
