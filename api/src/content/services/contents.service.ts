// templates/service/service.ejs
import { Injectable } from "@nestjs/common";
import { Prisma, contents } from "@prisma/client";
import { BaseService } from "@core/base/base.service";
import { PaginationService } from "@core/services/pagination.service";
import { PrismaService } from "@core/services/prisma.service";
import { ContentsModel } from "../models/contents.model";

@Injectable()
export class ContentsService extends BaseService<"contents"> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService
  ) {
    super(paginationService, "contents");
  }

  async findWithRelations(id: string): Promise<ContentsModel | null> {
    const result = await this.prisma.contents.findUnique({
      where: { id },
      include: {
        bookmarks: true,
        content_statuses: true,
        content_tags: true,
        content_categories: true,
        content_source_visits: true,
        news: true,
        newsletters: true,
        research: true,
      },
    });
    return result ? this.mapToModel(result) : null;
  }

  async findMany(params: Prisma.contentsDefaultArgs): Promise<ContentsModel[]> {
    const items = await this.prisma.contents.findMany(params);
    return items.map((item) => this.mapToModel(item));
  }

  async findAllContents(
    query: Prisma.contentsFindManyArgs
  ): Promise<{ items: ContentsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.contents.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.contents.count({ where: query.where }),
    ]);

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    };
  }

  private mapToModel(data: any): ContentsModel {
    return {
      ...data,
    };
  }
}
