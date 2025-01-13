// provider.ejs template
import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@astronera/db'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import { RefundService } from '../services/refund.service'

@Controller('payments/refunds')
@ApiTags('Refund')
export class RefundController extends BaseController {
  constructor(
    protected readonly refundService: RefundService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('customer_refunds')
  }

  @Get()
  @ApiOperation({ summary: 'Get all refunds' })
  async findAllRefunds(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all plans')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch plans', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Refunds by id' })
  async findOneRefund(@Param('id', ParseIntPipe) id: number, @Query('include') include?: string[]) {
    try {
      return await super.findOne(id, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Post()
  @ApiOperation({ summary: 'Create Refund' })
  async createRefund(@Body() data: Prisma.customer_refundsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Refund' })
  async updateRefund(@Param('id') id: string, @Body() data: Prisma.customer_refundsUpdateInput) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
