// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ResearchEmbeddingModel } from '../models/research-embeddings.model'

@Injectable()
export class ResearchEmbeddingsService extends BaseService<'ResearchEmbeddings'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('ResearchEmbeddings')
  }

  async findWithRelations(id: number): Promise<ResearchEmbeddingModel | null> {
    const result = await this.prisma.researchEmbeddings.findUnique({
      where: { id },
      include: {
        embedding_reviews: true,
        research: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.ResearchEmbeddingsDefaultArgs): Promise<ResearchEmbeddingModel[]> {
    const items = await this.prisma.researchEmbeddings.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllResearchEmbeddings(
    query: Prisma.ResearchEmbeddingsFindManyArgs,
  ): Promise<{ items: ResearchEmbeddingModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.researchEmbeddings.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.researchEmbeddings.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ResearchEmbeddingModel {
    return {
      ...data,
    }
  }
}
