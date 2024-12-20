// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { embedding_reviews } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '../../core/services/pagination.service'
import type { PrismaService } from '../../core/services/prisma.service'
import type { EmbeddingReviewsModel } from '../models/embedding-reviews.model'

@Injectable()
export class EmbeddingReviewsService extends BaseService<'embedding_reviews'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'embedding_reviews')
  }

  async findWithRelations(id: number): Promise<EmbeddingReviewsModel | null> {
    const result = await this.prisma.embedding_reviews.findUnique({
      where: { id },
      include: {
        research_embeddings: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.embedding_reviewsDefaultArgs,
  ): Promise<EmbeddingReviewsModel[]> {
    const items = await this.prisma.embedding_reviews.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllEmbeddingReviews(
    query: Prisma.embedding_reviewsFindManyArgs,
  ): Promise<{ items: EmbeddingReviewsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.embedding_reviews.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.embedding_reviews.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): EmbeddingReviewsModel {
    return {
      ...data,
    }
  }
}
