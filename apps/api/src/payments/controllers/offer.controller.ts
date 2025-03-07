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
import { OfferService } from '../services/offer.service'
import { PaymentEventsService } from '../../observables/payments.observable'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('payments/offers')
@ApiTags('Offer')
export class OfferController extends BaseController {
  constructor(
    protected readonly offerService: OfferService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
    protected readonly paymentEventsService: PaymentEventsService,
  ) {
    super('CustomerSubscriptionOffers')
  }

  @Get()
  @ApiOperation({ summary: 'Get all offers' })
  async findAllOffers(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all offers')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch offers', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get Offers by id' })
  async findOneOffer(@Param('id', ParseIntPipe) id: string, @Query('include') include?: string[]) {
    try {
      return await super.findOne(id, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
