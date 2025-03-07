// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { OfferModel } from '../models/offer.model'
import { PaymentEventsService } from '../../observables/payments.observable'

@Injectable()
export class OfferService extends BaseService<'CustomerSubscriptionOffers'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
    protected readonly paymentEvents: PaymentEventsService,
  ) {
    super('CustomerSubscriptionOffers')
  }

  async findWithRelations(id: number): Promise<OfferModel | null> {
    const result = await this.prisma.customerSubscriptionOffers.findUnique({
      where: { id },
    })

    return result ? this.mapToModel(result) : null
  }

  async findOne(params: Prisma.CustomerSubscriptionOffersFindUniqueArgs): Promise<OfferModel> {
    const result = await this.prisma.customerSubscriptionOffers.findUnique({
      ...params,
      include: {
        plan: true,
      },
    })

    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CustomerSubscriptionOffersFindManyArgs): Promise<OfferModel[]> {
    const items = await this.prisma.customerSubscriptionOffers.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllOffers(
    query: Prisma.CustomerSubscriptionOffersFindManyArgs,
  ): Promise<{ items: OfferModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customerSubscriptionOffers.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customerSubscriptionOffers.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): OfferModel {
    return {
      ...data,
    }
  }
}
