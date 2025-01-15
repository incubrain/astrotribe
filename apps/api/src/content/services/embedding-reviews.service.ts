// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { EmbeddingReviewModel } from '../models/embedding-reviews.model'

@Injectable()
export class EmbeddingReviewsService extends BaseService<'EmbeddingReviews'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('EmbeddingReviews')
  }

  async findWithRelations(id: number): Promise<EmbeddingReviewModel | null> {
    const result = await this.prisma.embeddingReviews.findUnique({
      where: { id },
      include: {
        research_embeddings: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.EmbeddingReviewsDefaultArgs): Promise<EmbeddingReviewModel[]> {
    const items = await this.prisma.embeddingReviews.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllEmbeddingReviews(
    query: Prisma.EmbeddingReviewsFindManyArgs,
  ): Promise<{ items: EmbeddingReviewModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.embeddingReviews.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.embeddingReviews.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): EmbeddingReviewModel {
    return {
      ...data,
    }
  }
}
