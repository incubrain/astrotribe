// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { ProviderModel } from '../models/provider.model'

@Injectable()
export class ProviderService extends BaseService<'payment_providers'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('payment_providers')
  }

  async findWithRelations(id: number): Promise<ProviderModel | null> {
    const result = await this.prisma.payment_providers.findUnique({
      where: { id }
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.payment_providersFindManyArgs): Promise<ProviderModel[]> {
    const items = await this.prisma.payment_providers.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllProviders(
    query: Prisma.payment_providersFindManyArgs,
  ): Promise<{ items: ProviderModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.payment_providers.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.payment_providers.count({ where: query.where }),
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
