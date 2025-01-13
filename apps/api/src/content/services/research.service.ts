// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import type { Prisma } from '@astronera/db'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ResearchModel } from '../models/research.model'

@Injectable()
export class ResearchService extends BaseService<'research'> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly paginationService: PaginationService,
  ) {
    super('research')
  }

  async findWithRelations(id: string): Promise<ResearchModel | null> {
    const result = await this.prisma.research.findUnique({
      where: { id },
      include: {
        contents: true,
        research_embeddings: true,
      },
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.researchDefaultArgs): Promise<ResearchModel[]> {
    const items = await this.prisma.research.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async findAllResearch(
    query: Prisma.researchFindManyArgs,
  ): Promise<{ items: ResearchModel[]; total: number }> {
    const [items, total] = await Promise.all([
      this.prisma.research.findMany({
        skip: query.skip,
        take: query.take,
        where: query.where,
        orderBy: query.orderBy,
      }),
      this.prisma.research.count({ where: query.where }),
    ])

    return {
      items: items.map((item) => this.mapToModel(item)),
      total,
    }
  }

  private mapToModel(data: any): ResearchModel {
    return {
      ...data,
    }
  }
}
