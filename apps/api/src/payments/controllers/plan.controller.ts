// plan.ejs template
import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PlanService } from '../services/plan.service'
import { ConfigService } from '@nestjs/config'
import { PrismaService } from '@core/services/prisma.service'
import { PaginationService } from '@core/services/pagination.service'
import { CustomLogger } from '@core/logger/custom.logger'
import { BaseController } from '@core/base/base.controller'

import type { Prisma } from '@prisma/client'
import type { PaginatedResponse, PaginatedQuery } from '@types'

@Controller('payments/plans')
@ApiTags('Plan')
export class PlanController extends BaseController {
  constructor(
    protected readonly planService: PlanService,
    protected readonly prisma: PrismaService,
    protected readonly config: ConfigService,
    protected readonly paginationService: PaginationService,
    protected readonly logger: CustomLogger,
  ) {
    super('customer_subscription_plans')
  }

  @Get()
  @ApiOperation({ summary: 'Get all plans' })
  async findAllPlans(
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
  @ApiOperation({ summary: 'Get plan by id' })
  async findOnePlan(
    @Param('id') id: number,
    @Query('include') include?: string[],
  ) {
    try {
      return await super.findOne(`${id}`, include)
    } catch (error: any) {
      return this.handleError(error)
    }
  }
}
