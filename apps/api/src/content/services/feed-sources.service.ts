// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import type { FeedSourceModel } from '../models/feed-sources.model'

@Injectable()
export class FeedSourceService extends BaseService<'FeedSources'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('FeedSources')
  }

  async findWithRelations(id: number): Promise<FeedSourceModel | null> {
    const result = await this.prisma.feedSources.findUnique({
      where: { id },
      include: {
        content_sources: true,
        feeds: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.FeedSourcesDefaultArgs): Promise<FeedSourceModel[]> {
    const items = await this.prisma.feedSources.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllFeedSources(
    query: Prisma.FeedSourcesFindManyArgs,
  ): Promise<{ items: FeedSourceModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.feedSources.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.feedSources.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): FeedSourceModel {
    return {
      ...data,
    }
  }
}
