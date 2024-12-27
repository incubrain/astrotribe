// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { news_summaries } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsSummaryModel } from '../models/news-summaries.model'

@Injectable()
export class NewsSummariesService extends BaseService<'news_summaries'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('news_summaries')
  }

  async findWithRelations(id: string): Promise<NewsSummaryModel | null> {
    const result = await this.prisma.news_summaries.findUnique({
      where: { id },
      include: {
        news: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.news_summariesDefaultArgs): Promise<NewsSummaryModel[]> {
    const items = await this.prisma.news_summaries.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsSummaries(
    query: Prisma.news_summariesFindManyArgs,
  ): Promise<{ items: NewsSummaryModel[]; total: number }> {
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

  private mapToModel(data: any): NewsSummaryModel {
    return {
      ...data,
    }
  }
}
