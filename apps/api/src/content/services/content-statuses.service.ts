// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentStatusesModel } from '../models/content-statuses.model'
import type { Prisma } from '@prisma/client'

@Injectable()
export class ContentStatusesService extends BaseService<'content_statuses'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('content_statuses')
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

  async findMany(params: Prisma.content_statusesDefaultArgs): Promise<ContentStatusesModel[]> {
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
