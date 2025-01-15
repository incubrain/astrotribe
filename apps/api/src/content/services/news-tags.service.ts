// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsTagModel } from '../models/news-tags.model'

@Injectable()
export class NewsTagsService extends BaseService<'NewsTags'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('NewsTags')
  }

  async findWithRelations(id: number): Promise<NewsTagModel | null> {
    const result = await this.prisma.newsTags.findUnique({
      where: { id },
      include: {
        tags: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.NewsTagsDefaultArgs): Promise<NewsTagModel[]> {
    const items = await this.prisma.newsTags.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsTags(
    query: Prisma.NewsTagsFindManyArgs,
  ): Promise<{ items: NewsTagModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.newsTags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.newsTags.count({ where: query.where }),
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
