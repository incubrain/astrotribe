import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@/core/base/base.service'
import { PaginationService } from '@/core/services/pagination.service'
import { PrismaService } from '@/core/services/prisma.service'
import type { FeedCategoriesModel } from '../models/feed-categories.model'

@Injectable()
export class FeedCategoriesService extends BaseService<'feed_categories'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('feed_categories')
  }

  async findWithRelations(id: number): Promise<FeedCategoriesModel | null> {
    const result = await this.prisma.feed_categories.findUnique({
      where: { id },
      include: {
        categories: true,
        feeds: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.feed_categoriesDefaultArgs): Promise<FeedCategoriesModel[]> {
    const items = await this.prisma.feed_categories.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllFeedCategories(
    query: Prisma.feed_categoriesFindManyArgs,
  ): Promise<{ items: FeedCategoriesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.feed_categories.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.feed_categories.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): FeedCategoriesModel {
    return {
      ...data,
    }
  }
}
