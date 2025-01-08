// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { PaymentModel } from '../models/payment.model'

@Injectable()
export class PaymentService extends BaseService<'customer_payments'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('customer_payments')
  }

  async updatePayment(data) {
    const result = await this.prisma.customer_payments.upsert({
      where: {
        external_payment_id: data.external_payment_id
      },
      update: data,
      create: data
    })

    return result
  }

  async findWithRelations(id: number): Promise<PaymentModel | null> {
    const result = await this.prisma.customer_payments.findUnique({
      where: { id }
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.customer_paymentsFindManyArgs): Promise<PaymentModel[]> {
    const items = await this.prisma.customer_payments.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllPayments(
    query: Prisma.customer_paymentsFindManyArgs,
  ): Promise<{ items: PaymentModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.customer_payments.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.customer_payments.count({ where: query.where }),
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
