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
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import type { Prisma } from '@prisma/client'
import type { ConfigService } from '@nestjs/config'
import { BaseController } from '@core/base/base.controller'
import type { PrismaService } from '@core/services/prisma.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PaginatedQuery } from '@types'
import { PaginatedResponse } from '@types'
import type { CustomLogger } from '@core/logger/custom.logger'
import { PermissionGuard } from '@core/guards/permission.guard'
import type { ContentService } from '../services/content.service'

@Controller('contents')
@UseGuards(PermissionGuard)
@ApiTags('Contents')
export class ContentController extends BaseController {
  constructor(
    protected readonly contentService: ContentService,
    prisma: PrismaService,
    config: ConfigService,
    paginationService: PaginationService,
    logger: CustomLogger,
  ) {
    super(prisma, 'contents', config, paginationService, logger)
  }

  @Get()
  @ApiOperation({ summary: 'Get all content with company logos' })
  async getAllContent(@Query() query: PaginatedQuery) {
    try {
      return await this.contentService.getAllContent(query)
    } catch (error) {
      throw new HttpException(
        error.message || 'An error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Contents by id' })
  async findOneContents(
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
  @ApiOperation({ summary: 'Create Contents' })
  async createContents(@Body() data: Prisma.contentsCreateInput) {
    try {
      return await super.create(data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Contents' })
  async updateContents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.contentsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Contents' })
  async removeContents(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error) {
      return this.handleError(error)
    }
  }
}