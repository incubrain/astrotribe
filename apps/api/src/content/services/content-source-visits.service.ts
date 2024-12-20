// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { BaseService } from '@/core/base/base.service'
import { PaginationService } from '@/core/services/pagination.service'
import { PrismaService } from '@/core/services/prisma.service'
import { ContentSourceVisitsModel } from '../models/content-source-visits.model'

@Injectable()
export class ContentSourceVisitService extends BaseService<'content_source_visits'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('content_source_visits')
  }

  async findWithRelations(id: string): Promise<ContentSourceVisitsModel | null> {
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
