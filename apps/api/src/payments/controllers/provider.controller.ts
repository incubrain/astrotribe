// provider.ejs template
import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { ProviderService } from '../services/provider.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('payments/providers')
@ApiTags('Provider')
export class ProviderController extends BaseController {
  constructor(
    protected readonly providerService: ProviderService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('PaymentProviders')
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment providers' })
  async findAllPaymentProviders(
    @Query() query: PaginatedQuery,
  ): Promise<
    PaginatedResponse<unknown> | { success: boolean; error: any; timestamp: string; code: any }
  > {
    try {
      this.logger.log('Fetching all payment providers')
      return super.findAll(query)
    } catch (error: any) {
      this.logger.error('Failed to fetch payment providers', error.stack)
      throw error
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment provider by id' })
  async findOneProvider(@Param('id') id: number, @Query('include') include?: string[]) {
    try {
      return await super.findOne(`${id}`, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
