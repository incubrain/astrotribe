// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentStatusesModel } from '../models/content-statuses.model'
import type { Prisma } from '@astronera/db'

@Injectable()
export class ContentStatusesService extends BaseService<'ContentStatuses'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ContentStatuses')
  }

  async findWithRelations(id: string): Promise<ContentStatusesModel | null> {
    const result = await this.prisma.contentStatuses.findUnique({
      where: { id },
      include: {
        contents: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.ContentStatusesDefaultArgs): Promise<ContentStatusesModel[]> {
    const items = await this.prisma.contentStatuses.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentStatuses(
    query: Prisma.ContentStatusesFindManyArgs,
  ): Promise<{ items: ContentStatusesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contentStatuses.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.contentStatuses.count({ where: query.where }),
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
