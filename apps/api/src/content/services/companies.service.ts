// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { CompanyModel } from '../models/companies.model'

@Injectable()
export class CategoriesService extends BaseService<'Companies'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('Companies')
  }

  async findWithRelations(id: number): Promise<CompanyModel | null> {
    const result = await this.prisma.companies.findUnique({
      where: { id },
      include: {
        companies: true,
        content_categories: true,
        feed_categories: true,
        news: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.CategoriesDefaultArgs): Promise<CompanyModel[]> {
    const items = await this.prisma.companies.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllCategories(
    query: Prisma.CategoriesFindManyArgs,
  ): Promise<{ items: CompanyModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.companies.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.companies.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): CompanyModel {
    return {
      ...data,
    }
  }
}
