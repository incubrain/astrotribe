// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { SubscriptionModel } from '../models/subscription.model'

@Injectable()
export class SubscriptionService extends BaseService<'customer_subscriptions'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('customer_subscriptions')
  }

  async updateSubscription(data) {
    const result = await this.prisma.customer_subscriptions.update({
      where: { external_subscription_id: data.external_subscription_id },
      data,
    })

    return result
  }

  async findWithRelations(id: number): Promise<SubscriptionModel | null> {
    const result = await this.prisma.customer_subscriptions.findUnique({
      where: { id },
      include: {
        customer_subscription_plans: true,
        payment_providers: true,
      },
    })

    if (result) result.notes = result.notes || []
    return result ? this.mapToModel(result) : null
  }

  async findOne(params: Prisma.customer_subscriptionsFindUniqueArgs): Promise<SubscriptionModel> {
    const result = await this.prisma.customer_subscriptions.findUnique({
      ...params,
      include: {
        payment_providers: true,
      },
    })

    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.customer_subscriptionsFindManyArgs): Promise<SubscriptionModel[]> {
    const items = await this.prisma.customer_subscriptions.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllSubscriptions(
    query: Prisma.customer_subscriptionsFindManyArgs,
  ): Promise<{ items: SubscriptionModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customer_subscriptions.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customer_subscriptions.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): SubscriptionModel {
    return {
      ...data,
    }
  }
}
