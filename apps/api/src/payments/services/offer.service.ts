// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { OfferModel } from '../models/offer.model'
import { PaymentEventsService } from '../../observables/payments.observable'

@Injectable()
export class OfferService extends BaseService<'CustomerOffers'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
    protected readonly paymentEvents: PaymentEventsService,
  ) {
    super('CustomerOffers')
  }

  async findWithRelations(id: number): Promise<OfferModel | null> {
    const result = await this.prisma.customerOffers.findUnique({
      where: { id },
    })

    return result ? this.mapToModel(result) : null
  }

  async findOne(params: Prisma.CustomerOffersFindUniqueArgs): Promise<OfferModel> {
    const result = await this.prisma.customerOffers.findUnique({
      ...params,
      include: {
        plan: true,
      },
    })

    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CustomerOffersFindManyArgs): Promise<OfferModel[]> {
    const items = await this.prisma.customerOffers.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllOffers(
    query: Prisma.CustomerOffersFindManyArgs,
  ): Promise<{ items: OfferModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customerOffers.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customerOffers.count({ where: query.where }),
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
