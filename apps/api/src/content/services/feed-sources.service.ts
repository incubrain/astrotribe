// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { feed_sources } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { FeedSourcesModel } from '../models/feed-sources.model'

@Injectable()
export class FeedSourceService extends BaseService<'feed_sources'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'feed_sources')
  }

  async findWithRelations(id: number): Promise<FeedSourcesModel | null> {
    const result = await this.prisma.feed_sources.findUnique({
      where: { id },
      include: {
        content_sources: true,
        feeds: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.feed_sourcesDefaultArgs,
  ): Promise<FeedSourcesModel[]> {
    const items = await this.prisma.feed_sources.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllFeedSources(
    query: Prisma.feed_sourcesFindManyArgs,
  ): Promise<{ items: FeedSourcesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.feed_sources.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.feed_sources.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): FeedSourcesModel {
    return {
      ...data,
    }
  }
}
