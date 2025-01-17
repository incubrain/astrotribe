// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentTagModel } from '../models/content-tags.model'
import type { Prisma } from '@astronera/db'

@Injectable()
export class ContentTagsService extends BaseService<'ContentTags'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ContentTags')
  }

  async findWithRelations(id: string, tagId: number): Promise<ContentTagModel | null> {
    const result = await this.prisma.contentTags.findUnique({
      where: { content_id_tag_id: { content_id: id, tag_id: tagId } },
      include: {
        contents: true,
        tags: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.ContentTagsDefaultArgs): Promise<ContentTagModel[]> {
    const items = await this.prisma.contentTags.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllContentTags(
    query: Prisma.ContentTagsFindManyArgs,
  ): Promise<{ items: ContentTagModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contentTags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.contentTags.count({ where: query.where }),
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
