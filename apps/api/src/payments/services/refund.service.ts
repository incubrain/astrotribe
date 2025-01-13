// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { RefundModel } from '../models/refund.model'

@Injectable()
export class RefundService extends BaseService<'customer_refunds'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('customer_refunds')
  }

  async findWithRelations(id: number): Promise<RefundModel | null> {
    const result = await this.prisma.customer_refunds.findUnique({
      where: { id },
      include: {
        customer_payments: true,
      },
    })

    if (result) result.notes = result.notes || []
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.customer_refundsFindManyArgs): Promise<RefundModel[]> {
    const items = await this.prisma.customer_refunds.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllRefunds(
    query: Prisma.customer_refundsFindManyArgs,
  ): Promise<{ items: RefundModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customer_refunds.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customer_refunds.count({ where: query.where }),
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
