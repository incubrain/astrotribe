// templates/service/service.ejs
import { Injectable } from "@nestjs/common";
import { Prisma, content_sources } from "@prisma/client";
import { BaseService } from "@core/base/base.service";
import { PaginationService } from "@core/services/pagination.service";
import { PrismaService } from "@core/services/prisma.service";
import { ContentSourcesModel } from "../models/content-sources.model";

@Injectable()
export class ContentSourcesService extends BaseService<"content_sources"> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService
  ) {
    super(paginationService, "content_sources");
  }

  async findWithRelations(id: number): Promise<ContentSourcesModel | null> {
    const result = await this.prisma.content_sources.findUnique({
      where: { id },
      include: {
        companies: true,
        feed_sources: true,
        news: true,
      },
    });
    return result ? this.mapToModel(result) : null;
  }

  async findMany(
    params: Prisma.content_sourcesDefaultArgs
  ): Promise<ContentSourcesModel[]> {
    const items = await this.prisma.content_sources.findMany(params);
    return items.map((item) => this.mapToModel(item));
  }

  async findAllContentSources(
    query: Prisma.content_sourcesFindManyArgs
  ): Promise<{ items: ContentSourcesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_sources.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.content_sources.count({ where: query.where }),
    ]);

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    };
  }

  private mapToModel(data: any): ContentSourcesModel {
    return {
      ...data,
    };
  }
}
