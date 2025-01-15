// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentSourceVisitsModel } from '../models/content-source-visits.model'

@Injectable()
export class ContentSourceVisitService extends BaseService<'ContentSourceVisits'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ContentSourceVisits')
  }

  async findWithRelations(id: string): Promise<ContentSourceVisitsModel | null> {
    const result = await this.prisma.contentSourceVisits.findUnique({
      where: { id },
      include: {
        contents: true,
        user_profiles: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.ContentSourceVisitsDefaultArgs,
  ): Promise<ContentSourceVisitsModel[]> {
    const items = await this.prisma.contentSourceVisits.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentSourceVisits(
    query: Prisma.ContentSourceVisitsFindManyArgs,
  ): Promise<{ items: ContentSourceVisitsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contentSourceVisits.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.contentSourceVisits.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ContentSourceVisitsModel {
    return {
      ...data,
    }
  }
}
