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
import { CompaniesService } from '../services/companies.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@astronera/db'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('companies')
@ApiTags('Companies')
export class CompanyController extends BaseController {
  constructor(
    protected readonly companiesService: CompaniesService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('companies')
  }

  @Get()
  @ApiOperation({ summary: 'Get all Categories' })
  async findAllCompanies(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all Companies')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch Companies', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Companies by id' })
  async findOneCompanies(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('include') include?: string[],
  ) {
    try {
      return await super.findOne(id, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
