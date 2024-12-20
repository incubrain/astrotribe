// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { news_summaries } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { NewsSummariesModel } from '../models/news-summaries.model'

@Injectable()
export class NewsSummariesService extends BaseService<'news_summaries'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'news_summaries')
  }

  async findWithRelations(id: string): Promise<NewsSummariesModel | null> {
    const result = await this.prisma.news_summaries.findUnique({
      where: { id },
      include: {
        news: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.news_summariesDefaultArgs,
  ): Promise<NewsSummariesModel[]> {
    const items = await this.prisma.news_summaries.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsSummaries(
    query: Prisma.news_summariesFindManyArgs,
  ): Promise<{ items: NewsSummariesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.news_summaries.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.news_summaries.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): NewsSummariesModel {
    return {
      ...data,
    }
  }
}
