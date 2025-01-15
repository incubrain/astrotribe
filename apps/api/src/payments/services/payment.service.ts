// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { PaymentModel } from '../models/payment.model'

@Injectable()
export class PaymentService extends BaseService<'CustomerPayments'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('CustomerPayments')
  }

  async updatePayment(data) {
    const result = await this.prisma.customerPayments.upsert({
      where: {
        external_payment_id: data.external_payment_id,
      },
      update: data,
      create: data,
    })

    return result
  }

  async findWithRelations(id: number): Promise<PaymentModel | null> {
    const result = await this.prisma.customerPayments.findUnique({
      where: { id },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CustomerPaymentsFindManyArgs): Promise<PaymentModel[]> {
    const items = await this.prisma.customerPayments.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllPayments(
    query: Prisma.CustomerPaymentsFindManyArgs,
  ): Promise<{ items: PaymentModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customerPayments.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customerPayments.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): PaymentModel {
    return {
      ...data,
    }
  }
}
