// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsletterModel } from '../models/newsletters.model'

@Injectable()
export class NewslettersService extends BaseService<'newsletters'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('newsletters')
  }

  async findWithRelations(id: string): Promise<NewsletterModel | null> {
    const result = await this.prisma.newsletters.findUnique({
      where: { id },
      include: {
        contents: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.newslettersDefaultArgs): Promise<NewsletterModel[]> {
    const items = await this.prisma.newsletters.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsletters(
    query: Prisma.newslettersFindManyArgs,
  ): Promise<{ items: NewsletterModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.newsletters.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.newsletters.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): NewsletterModel {
    return {
      ...data,
    }
  }
}
