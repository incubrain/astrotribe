// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentSourceModel } from '../models/content-sources.model'
import { Prisma } from '@astronera/db'

@Injectable()
export class ContentSourcesService extends BaseService<'ContentSources'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ContentSources')
  }

  async findWithRelations(id: number): Promise<ContentSourceModel | null> {
    const result = await this.prisma.contentSources.findUnique({
      where: { id },
      include: {
        companies: true,
        feed_sources: true,
        news: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.ContentSourcesDefaultArgs): Promise<ContentSourceModel[]> {
    const items = await this.prisma.contentSources.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentSources(
    query: Prisma.ContentSourcesFindManyArgs,
  ): Promise<{ items: ContentSourceModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contentSources.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.contentSources.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ContentSourceModel {
    return {
      ...data,
    }
  }
}
