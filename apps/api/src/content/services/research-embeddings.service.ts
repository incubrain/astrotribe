// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@prisma/client'
import { research_embeddings } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import type { PaginationService } from '@core/services/pagination.service'
import type { PrismaService } from '@core/services/prisma.service'
import type { ResearchEmbeddingsModel } from '../models/research-embeddings.model'

@Injectable()
export class ResearchEmbeddingsService extends BaseService<'research_embeddings'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'research_embeddings')
  }

  async findWithRelations(id: number): Promise<ResearchEmbeddingsModel | null> {
    const result = await this.prisma.research_embeddings.findUnique({
      where: { id },
      include: {
        embedding_reviews: true,
        research: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(
    params: Prisma.research_embeddingsDefaultArgs,
  ): Promise<ResearchEmbeddingsModel[]> {
    const items = await this.prisma.research_embeddings.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllResearchEmbeddings(
    query: Prisma.research_embeddingsFindManyArgs,
  ): Promise<{ items: ResearchEmbeddingsModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.research_embeddings.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.research_embeddings.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ResearchEmbeddingsModel {
    return {
      ...data,
    }
  }
}
