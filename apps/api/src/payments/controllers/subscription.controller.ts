// provider.ejs template
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import { SubscriptionService } from '../services/subscription.service'

@Controller('payments/subscriptions')
@ApiTags('Subscription')
export class SubscriptionController extends BaseController {
  constructor(
    protected readonly subscriptionService: SubscriptionService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('customer_subscriptions')
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  async findAllSubscriptions(
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
  @ApiOperation({ summary: 'Get Subscriptions by id' })
  async findOneSubscription(
    @Param('id', ParseIntPipe) id: number,
    @Query('include') include?: string[],
  ) {
    try {
      return await super.findOne(id, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
  
  @Post()
  @ApiOperation({ summary: 'Create Subscription' })
  async createSubscription(@Body() data: Prisma.customer_subscriptionsCreateInput) {
    try {
      return await super.create(data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Subscription' })
  async updateSubscription(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: Prisma.customer_subscriptionsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
