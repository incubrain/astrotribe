// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { CategoryModel } from '../models/categories.model'

@Injectable()
export class CategoriesService extends BaseService<'categories'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('categories')
  }

  async findWithRelations(id: number): Promise<CategoryModel | null> {
    const result = await this.prisma.categories.findUnique({
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

  async findMany(params: Prisma.categoriesDefaultArgs): Promise<CategoryModel[]> {
    const items = await this.prisma.categories.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllCategories(
    query: Prisma.categoriesFindManyArgs,
  ): Promise<{ items: CategoryModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.categories.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.categories.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): CategoryModel {
    return {
      ...data,
    }
  }
}
