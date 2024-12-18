// templates/service/service.ejs
import { Injectable } from "@nestjs/common";
import { Prisma, content_categories } from "@prisma/client";
import { BaseService } from "@core/base/base.service";
import { PaginationService } from "@core/services/pagination.service";
import { PrismaService } from "@core/services/prisma.service";
import { ContentCategoriesModel } from "../models/content-categories.model";

@Injectable()
export class ContentCategoriesService extends BaseService<"content_categories"> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService
  ) {
    super(paginationService, "content_categories");
  }

  async findWithRelations(
    id: string,
    categoryId: number
  ): Promise<ContentCategoriesModel | null> {
    const result = await this.prisma.content_categories.findUnique({
      where: {
        content_id_category_id: {
          content_id: id,
          category_id: categoryId,
        },
      },
      include: {
        categories: true,
        contents: true,
      },
    });
    return result ? this.mapToModel(result) : null;
  }

  async findMany(
    params: Prisma.content_categoriesDefaultArgs
  ): Promise<ContentCategoriesModel[]> {
    const items = await this.prisma.content_categories.findMany(params);
    return items.map((item) => this.mapToModel(item));
  }

  async findAllContentCategories(
    query: Prisma.content_categoriesFindManyArgs
  ): Promise<{ items: ContentCategoriesModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.content_categories.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,

        include: {
          categories: true,

          contents: true,
        },
      }),
      this.prisma.content_categories.count({ where: query.where }),
    ]);

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    };
  }

  private mapToModel(data: any): ContentCategoriesModel {
    return {
      ...data,
    };
  }
}
