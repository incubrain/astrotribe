import TurndownService from 'turndown'
import { JobFactory } from '../../job.factory'
import { logFile } from '@helpers'
import { DatabaseUtils } from '../../utils/database.utils'
import { NewsContentScraper } from './news-page.scraper'
import { CustomLogger } from '@core'
import type { JobServices } from '@types'
import type { Page } from 'playwright'

interface NewsPageData {
  id: string
  url: string
  failed_count: number
  published_at: string | null
  description: string
  author: string | null
  title: string
  keywords: string[]
  featured_image: string | null
  body?: string
  hash?: number
  scraped_at?: string
  company_id?: string
}

export const createNewsPagesTask = (services: JobServices) => {
  const { logger, prisma } = services
  const newsScraper = new NewsContentScraper(logger)

  return JobFactory.createJob<NewsPageData, NewsPageData, NewsPageData>({
    name: 'news_pages',
    domain: 'news',
    version: '1.0.0',
    changes: ['Initial version'],
    schedule: {
      customCron: '*/20 * * * *',
      type: 'cron',
      enabled: true,
    },
    priority: 'high',
    timeout: 600000,
    handlers: {
      beforeProcess: async () => {
        try {
          const pages = await prisma.news.findMany({
            where: {
              body: null,
              failed_count: {
                lt: 3,
              },
            },
            select: {
              id: true,
              url: true,
              failed_count: true,
              published_at: true,
              description: true,
              author: true,
              title: true,
              keywords: true,
              featured_image: true,
              company_id: true,
            },
            take: 100,
          })

          return DatabaseUtils.convertBigIntToNumber(pages)
        } catch (error: any) {
          logger.error('Failed to fetch news pages', { error })
          throw error
        }
      },

      processFunction: async (pages: NewsPageData[]): Promise<NewsPageData[]> => {
        const { scraper, logger } = services
        const results: NewsPageData[] = []

        await DatabaseUtils.batchProcess({
          items: pages,
          batchSize: 10,
          processor: async (batch) => {
            try {
              const page = await scraper.newPage()
              page.setDefaultTimeout(60000)

              const batchResults = []
              for (const source of batch) {
                try {
                  await page.goto(source.url, { waitUntil: 'networkidle' })

                  const result = await newsScraper.extractContent(page, source)
                  batchResults.push(result)
                } catch (error: any) {
                  logger.error('Failed to scrape page', { error, url: source.url })
                  batchResults.push({
                    ...source,
                    failed_count: source.failed_count + 1,
                  })
                }
              }

              await page.close()
              results.push(...batchResults)
              return batchResults
            } catch (error: any) {
              logger.error('Batch processing failed', { error })
              return batch.map((source) => ({
                ...source,
                failed_count: source.failed_count + 1,
              }))
            }
          },
          logger,
        })

        return results
      },

      afterProcess: async (processedData: NewsPageData[]): Promise<NewsPageData[]> => {
        const { prisma, logger } = services

        logFile(
          'news_pages',
          {
            data: processedData,
          },
          true,
        )

        // Filter out failed scrapes
        processedData = processedData.filter((data) => data.body && data.failed_count === 0)

        if (processedData.length === 0) {
          logger.warn('No news pages to store')
          return []
        }

        try {
          const results = await DatabaseUtils.safeUpsert({
            prisma,
            logger,
            table: 'news',
            where: {
              urls: processedData.map((p) => p.url),
            },
            create: processedData.map((page) => ({
              ...page,
              created_at: DatabaseUtils.timestampOperations.nowUtc(),
            })),
            update: processedData.map((page) => ({
              ...page,
              updated_at: DatabaseUtils.timestampOperations.nowUtc(),
            })),
          })

          logger.info(`Stored ${results.length} news pages`)
          return results
        } catch (error: any) {
          logger.error('Failed to store news pages', {
            error,
            context: { pagesCount: processedData.length },
          })
          throw error
        }
      },

      onError: async (error: Error): Promise<void> => {
        const { logger } = services
        logger.error(`News pages job failed`, {
          error,
        })
      },
    },
  })
}
