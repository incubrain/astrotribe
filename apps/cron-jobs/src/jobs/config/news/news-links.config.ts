// src/jobs/news/news-links.job.ts
import { BaseJob } from '../../job.base'
import { DomainsForService, Service } from '@ib/logger'
import { NewsLinkExtractor } from '../../utils/link-extractor'
import type { JobServices, ContentSource, JobConfig } from '@types'
import { DatabaseUtils } from '../../utils/database.utils'
import { JobFactory } from '../../utils/job-factory'
import { error_type } from '@prisma/client'

interface ProcessedContent {
  contents: {
    url: string
    title: string
    description: string
    content: string
    published_at: Date
  }
  news: {
    url: string
    title: string
  }
}

interface OutputContent {
  contents: {
    url: string
    title: string
    description: string
    content: string
    published_at: Date
  }
}

export const createNewsLinksJob = (services: JobServices) => {
  return JobFactory.createJob<ContentSource, ProcessedContent, OutputContent>({
    name: 'news_links',
    domain: 'news_links',
    version: '1.2.0',
    changes: ['Added support for new sources'],
    schedule: {
      customCron: '0 */1 * * *',
      type: 'cron',
      enabled: true,
    },
    priority: 'high',
    timeout: 600000,
    handlers: {
      beforeProcess: async () => {
        const { prisma, logger } = services
        try {
          const sources = await prisma.content_sources.findMany({
            where: {
              content_type: 'news',
              OR: [
                { refreshed_at: null },
                {
                  refreshed_at: {
                    lt: DatabaseUtils.timestampOperations.subtractHours(new Date(), 1),
                  },
                },
              ],
              has_failed: false,
              failed_count: { lt: 3 },
            },
            take: 50,
          })
          return DatabaseUtils.convertBigIntToNumber(sources)
        } catch (error: any) {
          logger.error('Failed to fetch sources', { error })
          throw error
        }
      },
      processFunction: async (sources: ContentSource[]): Promise<ProcessedContent[]> => {
        const { scraper, logger, prisma, metrics } = services
        const results: ProcessedContent[] = []

        // Use batch processing
        await DatabaseUtils.batchProcess({
          items: sources,
          batchSize: 10, // Process 10 sources at a time
          processor: async (batch) => {
            const startTime = Date.now()
            const batchResults = []
            let browserInitialized = false

            for (const source of batch) {
              try {
                if (!source.rss_urls?.length && !browserInitialized) {
                  await scraper.init()
                  browserInitialized = true
                }

                const extractor = source.rss_urls?.length
                  ? new NewsLinkExtractor(null, source, { logger, prisma })
                  : new NewsLinkExtractor(await scraper.newPage(), source, { logger, prisma })

                const links = await extractor.extractBlogLinks()
                batchResults.push(...links)

                await metrics.trackJobCompletion('news_links', {
                  itemsProcessed: links.length,
                  success: true,
                  duration: Date.now() - startTime,
                })
              } catch (error) {
                await DatabaseUtils.handleEntityFailure(
                  prisma,
                  logger,
                  'content_sources',
                  { id: source.id.toString() },
                  error as Error,
                  { maxFailures: 3, disableAfterFailure: true },
                )
              }
            }
            return batchResults
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
              // Create contents with safe upsert
              const contents = await DatabaseUtils.safeUpsert({
                prisma: tx,
                logger,
                table: 'contents',
                where: { urls: results.map((r) => r.contents.url) },
                create: results.map((r) => ({
                  ...r.contents,
                  created_at: DatabaseUtils.timestampOperations.nowUtc(),
                })),
                update: results.map((r) => ({
                  ...r.contents,
                  updated_at: DatabaseUtils.timestampOperations.nowUtc(),
                })),
              })

              // Rest of transaction logic...
              return results
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
        logger.error(`News links job v1.2.0 failed`, {
          error,
        })
      },
    },
  })
}
