// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { NewsSummaries } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { NewsSummaryModel } from '../models/news-summaries.model'

@Injectable()
export class NewsSummariesService extends BaseService<'NewsSummaries'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('NewsSummaries')
  }

  async findWithRelations(id: string): Promise<NewsSummaryModel | null> {
    const result = await this.prisma.newsSummaries.findUnique({
      where: { id },
      include: {
        news: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.NewsSummariesDefaultArgs): Promise<NewsSummaryModel[]> {
    const items = await this.prisma.newsSummaries.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllNewsSummaries(
    query: Prisma.NewsSummariesFindManyArgs,
  ): Promise<{ items: NewsSummaryModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.newsSummaries.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.newsSummaries.count({ where: query.where }),
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
