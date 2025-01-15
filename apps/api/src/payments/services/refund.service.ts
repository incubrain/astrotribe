// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { RefundModel } from '../models/refund.model'

@Injectable()
export class RefundService extends BaseService<'CustomerRefunds'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('CustomerRefunds')
  }

  async findWithRelations(id: number): Promise<RefundModel | null> {
    const result = await this.prisma.customerRefunds.findUnique({
      where: { id },
      include: {
        customer_payments: true,
      },
    })

    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CustomerRefundsFindManyArgs): Promise<RefundModel[]> {
    const items = await this.prisma.customerRefunds.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllRefunds(
    query: Prisma.CustomerRefundsFindManyArgs,
  ): Promise<{ items: RefundModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customerRefunds.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customerRefunds.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): RefundModel {
    return {
      ...data,
    }
  }
}
