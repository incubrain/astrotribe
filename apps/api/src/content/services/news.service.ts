// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsModel } from '../models/news.model'

@Injectable()
export class NewsService extends BaseService<'News'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('News')
  }

  async findWithRelations(id: string): Promise<NewsModel | null> {
    const result = await this.prisma.news.findUnique({
      where: { id },
      include: {
        companies: true,
        categories: true,
        content_sources: true,
        contents: true,
        news_summaries: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.NewsDefaultArgs): Promise<NewsModel[]> {
    const items = await this.prisma.news.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNews(
    query: Prisma.NewsFindManyArgs,
  ): Promise<{ items: NewsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.news.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.news.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): NewsModel {
    return {
      ...data,
    }
  }
}
