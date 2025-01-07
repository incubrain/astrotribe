// payments.ejs template
import {
  Controller,
  Get,
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
import { PaymentService } from '../services/payment.service'

@Controller('payments')
@ApiTags('Payment')
export class PaymentController extends BaseController {
  constructor(
    protected readonly paymentService: PaymentService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('customer_payments')
  }

  @Get()
  @ApiOperation({ summary: 'Get all payments' })
  async findAllPaymentPayments(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all payments')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch payments', error.stack)
      throw error
    }
  }
}
