// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { TagModel } from '../models/tags.model'

@Injectable()
export class TagsService extends BaseService<'Tags'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('Tags')
  }

  async findWithRelations(id: number): Promise<TagModel | null> {
    const result = await this.prisma.tags.findUnique({
      where: { id },
      include: {
        content_tags: true,
        news_tags: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.TagsDefaultArgs): Promise<TagModel[]> {
    const items = await this.prisma.tags.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllTags(query: Prisma.TagsFindManyArgs): Promise<{ items: TagModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.tags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.tags.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): TagModel {
    return {
      ...data,
    }
  }
}
