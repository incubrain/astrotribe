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
import { ResearchService } from '../services/research.service'

import type { PaginatedResponse, PaginatedQuery } from '@types'
import type { Prisma } from '@astronera/db'

@Controller('research')
@ApiTags('Research')
export class ResearchController extends BaseController {
  constructor(
    protected readonly researchService: ResearchService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('Research')
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
    } catch (error: any) {
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
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Research' })
  async createResearch(@Body() data: Prisma.ResearchCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Research' })
  async updateResearch(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.ResearchUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Research' })
  async removeResearch(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
