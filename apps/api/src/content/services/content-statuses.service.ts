// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { content_statuses } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { ContentStatusesModel } from '../models/content-statuses.model'

@Injectable()
export class ContentStatusesService extends BaseService<'content_statuses'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'content_statuses')
  }

  async findWithRelations(id: string): Promise<ContentStatusesModel | null> {
    const result = await this.prisma.content_statuses.findUnique({
      where: { id },
      include: {
        contents: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.content_statusesDefaultArgs,
  ): Promise<ContentStatusesModel[]> {
    const items = await this.prisma.content_statuses.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentStatuses(
    query: Prisma.content_statusesFindManyArgs,
  ): Promise<{ items: ContentStatusesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_statuses.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.content_statuses.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ContentStatusesModel {
    return {
      ...data,
    }
  }
}
