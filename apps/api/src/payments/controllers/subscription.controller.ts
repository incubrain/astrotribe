// provider.ejs template
import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseInterceptors,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@astronera/db'
import type { PaginatedResponse, PaginatedQuery } from '@types'
import { SubscriptionService } from '../services/subscription.service'
import { PaymentEventsService } from '../../observables/payments.observable'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('payments/subscriptions')
@ApiTags('Subscription')
export class SubscriptionController extends BaseController {
  constructor(
    protected readonly subscriptionService: SubscriptionService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
    protected readonly paymentEventsService: PaymentEventsService,
  ) {
    super('CustomerSubscriptions')
  }

  @Get()
  @ApiOperation({ summary: 'Get all subscriptions' })
  async findAllSubscriptions(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all subscriptions')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch subscriptions', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Subscriptions by id' })
  async findOneSubscription(
    @Param('id', ParseIntPipe) id: string,
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
  async createSubscription(@Body() data: Prisma.CustomerSubscriptionsCreateInput) {
    try {
      const result = await super.create(data)

      this.paymentEventsService.emit({
        type: 'created',
        module: 'subscription',
        data: result,
      })
    } catch (error: any) {
      return this.handleError(error)
    }
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update Subscription' })
  async updateSubscription(
    @Param('id', ParseIntPipe) id: string,
    @Body() data: Prisma.CustomerSubscriptionsUpdateInput,
  ) {
    try {
      return await super.update(id, data)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
