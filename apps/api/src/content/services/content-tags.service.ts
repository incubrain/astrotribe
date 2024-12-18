// templates/service/service.ejs
import { Injectable } from "@nestjs/common";
import { Prisma, content_tags } from "@prisma/client";
import { BaseService } from "@core/base/base.service";
import { PaginationService } from "@core/services/pagination.service";
import { PrismaService } from "@core/services/prisma.service";
import { ContentTagsModel } from "../models/content-tags.model";

@Injectable()
export class ContentTagsService extends BaseService<"content_tags"> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService
  ) {
    super(paginationService, "content_tags");
  }

  async findWithRelations(id: string, tagId: number): Promise<ContentTagsModel | null> {
    const result = await this.prisma.content_tags.findUnique({
      where: { content_id_tag_id: { content_id: id, tag_id: tagId } },
      include: {
        contents: true,
        tags: true,
      },
    });
    return result ? this.mapToModel(result) : null;
  }

  async findMany(
    params: Prisma.content_tagsDefaultArgs
  ): Promise<ContentTagsModel[]> {
    const items = await this.prisma.content_tags.findMany(params);
    return items.map((item) => this.mapToModel(item));
  }

  async findAllContentTags(
    query: Prisma.content_tagsFindManyArgs
  ): Promise<{ items: ContentTagsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_tags.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.content_tags.count({ where: query.where }),
    ]);

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    };
  }

  private mapToModel(data: any): ContentTagsModel {
    return {
      ...data,
    };
  }
}
