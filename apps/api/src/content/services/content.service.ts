// templates/service/service.ejs
import { Injectable } from '@nestjs/common'
import { Prisma, contents } from '@prisma/client'
import { BaseService } from '@core/base/base.service'
import { PaginationService } from '@core/services/pagination.service'
import { PrismaService } from '@core/services/prisma.service'
import { ContentsModel } from '../models/contents.model'

@Injectable()
export class ContentService extends BaseService<'contents'> {
  constructor(
    private prisma: PrismaService,
    paginationService: PaginationService,
  ) {
    super(paginationService, 'contents')
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
    })
    return result ? this.mapToModel(result) : null
  }

  async findMany(params: Prisma.contentsDefaultArgs): Promise<ContentsModel[]> {
    const items = await this.prisma.contents.findMany(params)
    return items.map((item) => this.mapToModel(item))
  }

  async getAllContent(query: PaginatedQuery) {
    const { skip, take } = this.paginationService.getSkipTake(query)

    const [items, total] = await Promise.all([
      this.prisma.contents.findMany({
        where: {
          content_type: 'news',
        },
        skip,
        take,
        select: {
          id: true,
          title: true,
          url: true,
          content_type: true,
          hot_score: true,
          created_at: true,
          updated_at: true,
          // Include related news data
          news: {
            select: {
              description: true,
              featured_image: true,
              author: true,
              published_at: true,
              score: true,
              news_summaries: {
                where: {
                  is_current: true, // Only get current summaries
                },
                select: {
                  summary: true,
                  complexity_level: true,
                  version: true,
                },
              },
              companies: {
                select: {
                  logo_url: true,
                  name: true,
                },
              },
            },
          },
          content_categories: {
            select: {
              is_primary: true,
              categories: {
                select: {
                  name: true,
                },
              },
            },
          },
          content_tags: {
            select: {
              tags: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      }),
      this.prisma.contents.count({
        where: {
          content_type: 'news',
        },
      }),
    ])

    const transformedItems = items.map((content) => ({
      id: content.id,
      title: content.title,
      url: content.url,
      type: content.content_type,
      hotScore: content.hot_score,
      createdAt: content.created_at.toISOString(), // Format the date
      updatedAt: content.updated_at.toISOString(), // Format the date
      description: content.news?.description,
      featuredImage: content.news?.featured_image,
      author: content.news?.author,
      publishedAt: content.news?.published_at?.toISOString(), // Format optional date
      score: content.news?.score,
      summary: content.news?.news_summaries?.[0]?.summary, // Get the current summary
      summaryComplexity: content.news?.news_summaries?.[0]?.complexity_level,
      summaryVersion: content.news?.news_summaries?.[0]?.version,
      companyLogo: content.news?.companies?.logo_url,
      companyName: content.news?.companies?.name,
      categories: content.content_categories.map((cc) => ({
        name: cc.categories.name,
        isPrimary: cc.is_primary,
      })),
      tags: content.content_tags.map((ct) => ct.tags.name),
    }))

    return {
      data: transformedItems,
      meta: this.paginationService.getPaginationMeta(total, query),
      timestamp: new Date().toISOString(),
    }
  }

  private mapToModel(data: any): ContentsModel {
    return {
      ...data,
    }
  }
}
