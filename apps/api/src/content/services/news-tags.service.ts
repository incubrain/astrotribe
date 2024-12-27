// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsTagModel } from '../models/news-tags.model'

@Injectable()
export class NewsTagsService extends BaseService<'news_tags'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('news_tags')
  }

  async findWithRelations(id: number): Promise<NewsTagModel | null> {
    const result = await this.prisma.news_tags.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.news_tagsDefaultArgs): Promise<NewsTagModel[]> {
    const items = await this.prisma.news_tags.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsTags(
    query: Prisma.news_tagsFindManyArgs,
  ): Promise<{ items: NewsTagModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.news_tags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.news_tags.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): NewsTagModel {
    return {
      ...data,
    }
  }
}
