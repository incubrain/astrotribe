// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@/core/base/base.service'
import { PaginationService } from '@/core/services/pagination.service'
import { PrismaService } from '@/core/services/prisma.service'
import type { FeedsModel } from '../models/feeds.model'

@Injectable()
export class FeedsService extends BaseService<'feeds'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('feeds')
  }

  async findWithRelations(id: string): Promise<FeedsModel | null> {
    const result = await this.prisma.feeds.findUnique({
      where: { id },
      include: {
        feed_categories: true,
        feed_sources: true,
        user_profiles: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.feedsDefaultArgs): Promise<FeedsModel[]> {
    const items = await this.prisma.feeds.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllFeeds(
    query: Prisma.feedsFindManyArgs,
  ): Promise<{ items: FeedsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.feeds.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.feeds.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): FeedsModel {
    return {
      ...data,
    }
  }
}
