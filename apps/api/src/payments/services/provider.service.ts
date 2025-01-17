// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { ProviderModel } from '../models/provider.model'

@Injectable()
export class ProviderService extends BaseService<'PaymentProviders'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('PaymentProviders')
  }

  async findWithRelations(id: number): Promise<ProviderModel | null> {
    const result = await this.prisma.paymentProviders.findUnique({
      where: { id },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.PaymentProvidersFindManyArgs): Promise<ProviderModel[]> {
    const items = await this.prisma.paymentProviders.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllProviders(
    query: Prisma.PaymentProvidersFindManyArgs,
  ): Promise<{ items: ProviderModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.paymentProviders.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.paymentProviders.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ProviderModel {
    return {
      ...data,
    }
  }
}
