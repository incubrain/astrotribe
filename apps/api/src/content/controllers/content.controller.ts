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
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'
import { PermissionGuard } from '@core/guards/permission.guard'
import { ContentService } from '../services/content.service'
import { ApiBaseController } from '@core/base/base.controller'
import { ApiPaginatedResponse, ApiGetByIdResponse } from '@core/decorators/api.decorator'

import type { Prisma } from '@astronera/db'
import type { PaginatedQuery, PaginatedResponse } from '@types'

const ContentDto = {}

@ApiBaseController('contents')
@UseGuards(PermissionGuard)
export class ContentController extends BaseController {
  constructor(
    protected readonly contentService: ContentService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('Contents')
  }

  @Get()
  @ApiPaginatedResponse(ContentDto)
  @ApiOperation({ summary: 'Get all content with company logos' })
  async getAllContent(@Query() query: PaginatedQuery) {
    try {
      return await this.contentService.getAllContent(query)
    } catch (error: any) {
      throw new HttpException(
        error.message || 'An error occurred',
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  @Get(':id')
  @ApiGetByIdResponse(ContentDto)
  @ApiOperation({ summary: 'Get Contents by id' })
  async findOneContents(
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
  @ApiOperation({ summary: 'Create Contents' })
  async createContents(@Body() data: Prisma.ContentsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Contents' })
  async updateContents(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() data: Prisma.ContentsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete Contents' })
  async removeContents(@Param('id', ParseUUIDPipe) id: string) {
    try {
      return await super.remove(id)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
