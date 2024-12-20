// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { content_source_visits } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { ContentSourceVisitsModel } from '../models/content-source-visits.model'

@Injectable()
export class ContentSourceVisitService extends BaseService<'content_source_visits'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'content_source_visits')
  }

  async findWithRelations(
    id: string,
  ): Promise<ContentSourceVisitsModel | null> {
    const result = await this.prisma.content_source_visits.findUnique({
      where: { id },
      include: {
        contents: true,
        user_profiles: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.content_source_visitsDefaultArgs,
  ): Promise<ContentSourceVisitsModel[]> {
    const items = await this.prisma.content_source_visits.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentSourceVisits(
    query: Prisma.content_source_visitsFindManyArgs,
  ): Promise<{ items: ContentSourceVisitsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_source_visits.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.content_source_visits.count({ where: query.where }),
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
