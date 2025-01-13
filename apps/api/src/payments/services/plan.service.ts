// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { PlanModel } from '../models/plan.model'

@Injectable()
export class PlanService extends BaseService<'customer_subscription_plans'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('customer_subscription_plans')
  }

  async findWithRelations(id: number): Promise<PlanModel | null> {
    const result = await this.prisma.customer_subscription_plans.findUnique({
      where: { id },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.customer_subscription_plansFindManyArgs): Promise<PlanModel[]> {
    const items = await this.prisma.customer_subscription_plans.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllPlans(
    query: Prisma.customer_subscription_plansFindManyArgs,
  ): Promise<{ items: PlanModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customer_subscription_plans.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customer_subscription_plans.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): PlanModel {
    return {
      ...data,
    }
  }
}
