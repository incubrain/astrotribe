// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { BaseService } from '@core/base/base.service'
import type { ContentCategoryModel } from '../models/content-categories.model'

@Injectable()
export class ContentCategoriesService extends BaseService<'ContentCategories'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ContentCategories')
  }

  async findWithRelations(id: string, categoryId: number): Promise<ContentCategoryModel | null> {
    const result = await this.prisma.contentCategories.findUnique({
      where: {
        content_id_category_id: {
          content_id: id,
          category_id: categoryId,
        },
      },
      include: {
        categories: true,
        contents: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.ContentCategoriesDefaultArgs): Promise<ContentCategoryModel[]> {
    const items = await this.prisma.contentCategories.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentCategories(
    query: Prisma.ContentCategoriesFindManyArgs,
  ): Promise<{ items: ContentCategoryModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contentCategories.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,

        include: {
          categories: true,

          contents: true,
        },
      }),
      this.prisma.contentCategories.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ContentCategoryModel {
    return {
      ...data,
    }
  }
}
