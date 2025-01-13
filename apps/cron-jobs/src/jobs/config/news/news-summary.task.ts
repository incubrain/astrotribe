import { JobServices, NewsArticle } from '@types'
import { createClient, Agent, summarizerConfig } from '@agents'
import { DatabaseUtils } from '../../utils/database.utils'
import { JobFactory } from '../../job.factory'

interface ProcessedContent {
  news_id: string
  summary: string
}

interface OutputContent {
  news_id: string
  summary: string
  has_summary: boolean
}


export const createNewsSummarizerTask = (services: JobServices) => {
  return JobFactory.createJob<NewsArticle, ProcessedContent, OutputContent>({
    name: 'news_summary',
    domain: 'news',
    version: '1.0.0',
    changes: ['Initial version'],
    schedule: {
      customCron: '0 */1 * * *', // Every hour
      type: 'cron',
      enabled: true,
    },
    priority: 'low',
    timeout: 3600000, // 1 hour
    handlers: {
      beforeProcess: async () => {
        const { prisma, logger } = services
        try {
          const articles = await prisma.News.findMany({
            where: {
              has_summary: false,
              body: { not: null },
            },
            select: {
              id: true,
              title: true,
              body: true,
              author: true,
              description: true,
              url: true,
              published_at: true,
              content_status: true,
            },
            orderBy: {
              published_at: 'desc',
            },
            take: 10,
          })
          return DatabaseUtils.convertBigIntToNumber(articles)
        } catch (error: any) {
          logger.error('Failed to fetch articles', { error })
          throw error
        }
      },
      processFunction: async (articles: NewsArticle[], job): Promise<ProcessedContent[]> => {
        const { logger, metrics } = services
        const agent = new Agent(services, summarizerConfig);
        const results: ProcessedContent[] = []

        await DatabaseUtils.batchProcess({
          items: articles,
          batchSize: 5,
          processor: async (batch) => {
            const startTime = Date.now()

            for (const article of batch) {
              try {
                logger.info(`Processing article: ${article.id}`)

                const result = await agent.execute({
                  data: {
                    title: article.title || '',
                    author: article.author || 'Unknown',
                    published_at: article.published_at
                      ? new Date(article.published_at).toISOString()
                      : undefined,
                    body: article.body || '',
                  },
                })

                results.push({
                  news_id: article.id.toString(),
                  summary: result.result,
                })

                await metrics.trackJobCompletion('news_summary', job.id, {
                  itemsProcessed: 1,
                  success: true,
                  duration: Date.now() - startTime,
                })
              } catch (error) {
                await DatabaseUtils.handleEntityFailure(
                  services.prisma,
                  logger,
                  'news',
                  { id: article.id.toString() },
                  error as Error,
                  { maxFailures: 3, disableAfterFailure: true },
                )
              }
            }
            return results
          },
          logger,
        })

        return results
      },
      afterProcess: async (results: ProcessedContent[]): Promise<OutputContent[]> => {
        const { prisma, logger } = services

        if (!results.length) return []

        try {
          return await DatabaseUtils.executeTransaction({
            prisma,
            logger,
            operation: async (tx) => {
              // Create summaries with safe upsert
              const summaries = await DatabaseUtils.safeUpsert({
                prisma: tx,
                logger,
                table: 'news_summaries',
                where: { news_ids: results.map((r) => r.news_id) },
                create: results.map((r) => ({
                  news_id: r.news_id,
                  summary: r.summary,
                  created_at: DatabaseUtils.timestampOperations.nowUtc(),
                })),
                update: results.map((r) => ({
                  news_id: r.news_id,
                  summary: r.summary,
                  updated_at: DatabaseUtils.timestampOperations.nowUtc(),
                })),
              })

              // Update news articles to mark as summarized
              await tx.news.updateMany({
                where: { id: { in: results.map((r) => r.news_id) } },
                data: { has_summary: true },
              })

              return results.map((r) => ({
                ...r,
                has_summary: true,
              }))
            },
            maxRetries: 3,
            retryDelay: 1000,
          })
        } catch (error: any) {
          logger.error('Failed to process results', {
            error,
            context: { resultsCount: results.length },
          })
          throw error
        }
      },
      onError: async (error: Error): Promise<void> => {
        const { logger } = services
        logger.error(`News summarizer job v1.0.0 failed`, {
          error,
        })
      },
    },
  })
}
