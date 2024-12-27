// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentTagModel } from '../models/content-tags.model'
import type { Prisma } from '@prisma/client'

@Injectable()
export class ContentTagsService extends BaseService<'content_tags'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('content_tags')
  }

  async findWithRelations(id: string, tagId: number): Promise<ContentTagModel | null> {
    const result = await this.prisma.content_tags.findUnique({
      where: { content_id_tag_id: { content_id: id, tag_id: tagId } },
      include: {
        contents: true,
        tags: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.content_tagsDefaultArgs): Promise<ContentTagModel[]> {
    const items = await this.prisma.content_tags.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentTags(
    query: Prisma.content_tagsFindManyArgs,
  ): Promise<{ items: ContentTagModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_tags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.content_tags.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ContentTagModel {
    return {
      ...data,
    }
  }
}
