// src/jobs/news/news-links.job.ts
import { BaseJob } from '../../job.base'
import { DomainsForService, Service } from '@ib/logger'
import { NewsLinkExtractor } from '../../utils/link-extractor'
import type { JobServices, ContentSource } from '@types'

export class NewsLinksJob extends BaseJob<ContentSource[], any[]> {
  readonly name = 'news_links'
  readonly schedule = '0 */1 * * *'
  readonly version = '1.2.0'
  readonly changes = [
    'Added support for new news sources',
    'Improved error handling',
    'Added rate limiting',
  ]

  constructor(protected readonly services: JobServices) {
    const { queue, scraper, logger, event } = services
    super(services)
    logger.info('NewsLinksJob initialized', { version: this.version })
  }

  getDomain(): DomainsForService<Service.JOBS> {
    return 'news_links'
  }

  protected getConfig() {
    return {
      schedule: this.schedule,
    }
  }

  async process(sources: ContentSource[]): Promise<any[]> {
    const { scraper, logger, prisma, metrics } = this.services

    const startTime = Date.now()

    logger.info('Starting news links processing', {
      sourcesCount: sources.length,
      version: this.version,
    })

    const results: any[] = []

    logger.info('Processing sources batch', {
      batchSize: sources.length,
      firstSource: sources[0]?.url,
      lastSource: sources[sources.length - 1]?.url,
    })

    for (let i = 0; i < sources.length; i++) {
      const source = sources[i]

      logger.info(`Processing source ${i + 1}/${sources.length}`, {
        sourceUrl: source.url,
        sourceId: source.id,
      })

      const extractor = new NewsLinkExtractor(await scraper.newPage(), source)

      try {
        logger.debug('Opening new browser page')
        const page = await scraper.newPage()

        try {
          logger.debug(`Navigating to ${source.url}`)
          await page.goto(source.url, {
            waitUntil: 'networkidle',
            timeout: 30000,
          })

          logger.debug('Extracting news links')
          const links = await extractor.extractBlogLinks()
          logger.info('Links extracted successfully', {
            sourceUrl: source.url,
            linksFound: links.length,
          })

          results.push(...links)

          const progress = Math.round(((i + 1) / sources.length) * 100)
          // this.emitProgress(job.id, progress)
          logger.debug(`Progress: ${progress}%`)

          const duration = Date.now() - startTime
          await metrics.trackJobCompletion(this.name, {
            itemsProcessed: links.length,
            success: true,
            duration,
          })
        } finally {
          logger.debug('Closing browser page')
          await page.close()
        }
      } catch (error: any) {
        logger.error(`Failed to process source ${source.url}`, {
          ...error,
          sourceId: source.id,
          attempt: i + 1,
        })

        try {
          logger.debug('Updating source failure count')
          await prisma.content_sources.update({
            where: { id: source.id },
            data: {
              has_failed: true,
              failed_count: {
                increment: 1,
              },
            },
          })
          logger.debug('Source failure count updated')
        } catch (updateError) {
          logger.error('Failed to update source failure count', {
            ...updateError,
            sourceId: source.id,
          })
        }
      }
    }

    logger.info('Completed processing all sources', {
      processedCount: sources.length,
      successfulResults: results.length,
    })

    return results
  }

  protected async beforeProcess(): Promise<ContentSource[]> {
    const { prisma, logger } = this.services

    logger.info('Starting beforeProcess')

    try {
      const sources = await prisma.content_sources.findMany({
        where: {
          content_type: 'news',
          OR: [
            { refreshed_at: null },
            {
              refreshed_at: {
                lt: new Date(Date.now() - 3600000),
              },
            },
          ],
          has_failed: false,
          failed_count: {
            lt: 3,
          },
        },
        take: 50,
      })

      logger.info('Found sources to process', {
        count: sources.length,
        sourceUrls: sources.map((s) => s.url),
      })

      return sources
    } catch (error: any) {
      logger.error('Failed to fetch sources in beforeProcess', { ...error })
      throw error
    }
  }

  protected async afterProcess(results: any[]): Promise<void> {
    const { prisma, logger } = this.services

    logger.info('Starting afterProcess', { resultsCount: results.length })

    try {
      await prisma.$transaction(async (tx) => {
        // Create contents
        logger.debug('Creating content records')
        const contents = await tx.contents.createMany({
          data: results.map((r) => ({
            ...r.contents,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          skipDuplicates: true,
        })
        logger.debug('Content records created', { count: contents.count })

        // Get content IDs
        logger.debug('Fetching content IDs')
        const contentIds = await tx.contents.findMany({
          where: {
            url: {
              in: results.map((r) => r.contents.url),
            },
          },
          select: {
            id: true,
            url: true,
          },
        })
        logger.debug('Content IDs fetched', { count: contentIds.length })

        // Map URLs to IDs
        const urlToId = new Map(contentIds.map((c) => [c.url, c.id]))

        // Create news records
        logger.debug('Creating news records')
        const news = await tx.news.createMany({
          data: results.map((r) => ({
            ...r.news,
            id: urlToId.get(r.contents.url)!,
            content_source_id: r.contentSource?.id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })),
          skipDuplicates: true,
        })
        logger.debug('News records created', { count: news.count })

        // Update content sources
        logger.debug('Updating content sources')
        const sourceIds = results.map((r) => r.contentSource?.id).filter(Boolean)
        await tx.content_sources.updateMany({
          where: {
            id: {
              in: sourceIds,
            },
          },
          data: {
            refreshed_at: new Date().toISOString(),
          },
        })
        logger.debug('Content sources updated', { count: sourceIds.length })

        logger.info('Transaction completed successfully', {
          contentsCreated: contents.count,
          newsCreated: news.count,
          sourcesUpdated: sourceIds.length,
        })

        return news
      })
    } catch (error: any) {
      logger.error('Failed to process results in afterProcess', {
        ...error,
        resultsCount: results.length,
      })
      throw error
    }
  }

  protected async onError(error: Error): Promise<void> {
    const { logger } = this.services
    logger.error(`News links job ${this.name} v${this.version} failed`, {
      ...error,
    })
    // Additional error handling (notifications, etc.)
  }
}
