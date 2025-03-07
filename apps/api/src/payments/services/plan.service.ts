// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { PlanModel } from '../models/plan.model'

@Injectable()
export class PlanService extends BaseService<'CustomerSubscriptionPlans'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('CustomerSubscriptionPlans')
  }

  async findWithRelations(id: number): Promise<PlanModel | null> {
    const result = await this.prisma.customerSubscriptionPlans.findUnique({
      where: { id },
      include: {
        offer: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CustomerSubscriptionPlansFindManyArgs): Promise<PlanModel[]> {
    const items = await this.prisma.customerSubscriptionPlans.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllPlans(
    query: Prisma.CustomerSubscriptionPlansFindManyArgs,
  ): Promise<{ items: PlanModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customerSubscriptionPlans.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customerSubscriptionPlans.count({ where: query.where }),
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
