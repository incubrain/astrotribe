// src/jobs/news/news-links.job.ts
import { BaseJob } from '../../job.base'
import { DomainsForService, Service } from '@ib/logger'
import { NewsLinkExtractor } from '../../utils/link-extractor'
import type { JobServices, ContentSource } from '@types'
import { error_type } from '@prisma/client'

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
    logger.info('NewsLinksJob initialized', {
      version: this.version,
      schedule: this.schedule,
      name: this.name,
    })
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
    const results: any[] = []
    let browserInitialized = false

    logger.info('Starting news links processing', {
      sourcesCount: sources.length,
      sourcesWithRSS: sources.filter((s) => s.rss_urls?.length > 0).length,
    })

    if (!sources.length) {
      logger.warn('No sources to process')
      return []
    }

    for (const source of sources) {
      try {
        // If source has RSS feeds, we don't need to initialize the browser yet
        if (!source.rss_urls?.length && !browserInitialized) {
          logger.info('Initializing browser for HTML scraping')
          await scraper.init()
          browserInitialized = true
        }

        // Create extractor with or without page based on RSS availability
        const extractor = source.rss_urls?.length
          ? new NewsLinkExtractor(null, source, { logger, prisma })
          : new NewsLinkExtractor(await scraper.newPage(), source, { logger, prisma })

        try {
          const links = await extractor.extractBlogLinks()

          if (links.length > 0) {
            results.push(...links)
            logger.info('Links extracted successfully', {
              sourceUrl: source.url,
              linksFound: links.length,
            })
          }

          // Track success
          await metrics.trackJobCompletion(this.name, {
            itemsProcessed: links.length,
            duration: 0,
            success: true,
          })
        } catch (error: any) {
          logger.error(`Failed to process source ${source.url}`, { error })
          await this.handleSourceFailure(source, error)
        }
      } catch (error: any) {
        logger.error(`Error processing source ${source.url}`, { error })
        await this.handleSourceFailure(source, error)
      }
    }

    logger.info('Completed processing all sources', {
      processedCount: sources.length,
      successfulResults: results.length,
    })

    return results
  }

  private async handleSourceFailure(source: ContentSource, error: any) {
    const { prisma, logger } = this.services

    try {
      await prisma.content_sources.update({
        where: { id: source.id },
        data: {
          has_failed: true,
          failed_count: { increment: 1 },
        },
      })
    } catch (updateError: any) {
      logger.error('Failed to update source failure count', {
        error: updateError,
        context: {
          sourceId: source.id,
        },
      })
    }
  }

  private convertBigIntToNumber(obj: any): any {
    if (obj === null || obj === undefined) {
      return obj
    }

    if (typeof obj === 'bigint') {
      return Number(obj)
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.convertBigIntToNumber(item))
    }

    if (typeof obj === 'object') {
      const newObj: any = {}
      for (const key in obj) {
        newObj[key] = this.convertBigIntToNumber(obj[key])
      }
      return newObj
    }

    return obj
  }

  protected async beforeProcess(): Promise<ContentSource[]> {
    const { prisma, logger } = this.services

    logger.info('Starting beforeProcess', {
      startTime: new Date().toISOString(),
    })

    try {
      logger.debug('Fetching content sources from database')
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

      logger.debug(`Fetched ${sources.length} Content sources`, {
        totalSources: sources.length,
        query: {
          content_type: 'news',
          refreshed_conditions: 'null or older than 1 hour',
          has_failed: false,
          failed_count_lt: 3,
          limit: 50,
        },
      })

      // Convert BigInt values to numbers
      const convertedSources = this.convertBigIntToNumber(sources)

      logger.info('Found sources to process', {
        count: convertedSources.length,
        sourceUrls: convertedSources.map((s) => s.url),
        sampleSources: convertedSources.slice(0, 3).map((s) => ({
          id: s.id,
          url: s.url,
          refreshed_at: s.refreshed_at,
          failed_count: s.failed_count,
        })),
        beforeProcessEndTime: new Date().toISOString(),
      })

      return convertedSources
    } catch (error: any) {
      logger.error('Failed to fetch sources in beforeProcess', {
        ...error,
        error_message: error.message,
        stack: error.stack,
        beforeProcessEndTime: new Date().toISOString(),
      })
      throw error
    }
  }

  protected async afterProcess(results: any[]): Promise<any[]> {
    const { prisma, logger } = this.services

    if (results.length === 0) {
      logger.debug('No results to process in afterProcess')
      return []
    }

    logger.debug('Starting afterProcess', {
      resultsCount: results.length,
    })

    try {
      await prisma.$transaction(async (tx) => {
        // Create contents
        logger.debug('Creating content records')
        const contents = await tx.contents.createMany({
          data: results.map((r) => ({
            ...r.contents,
            created_at: new Date(),
            updated_at: new Date(),
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
            created_at: new Date(),
            updated_at: new Date(),
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
            refreshed_at: new Date(),
          },
        })

        logger.info('Transaction completed successfully', {
          contentsCreated: contents.count,
          newsCreated: news.count,
          sourcesUpdated: sourceIds.length,
        })

        return results
      })

      logger.info('AfterProcess completed successfully', {
        processedResults: results.length,
      })

      return results
    } catch (error: any) {
      logger.error('Failed to process results in afterProcess', {
        error,
        context: {
          resultsCount: results.length,
          errorStack: error.stack,
        },
      })
      throw error
    }
  }

  protected async onError(error: any): Promise<void> {
    const { logger } = this.services
    logger.error(`News links job ${this.name} v${this.version} failed`, {
      ...error,
      error_message: error.message,
      error_stack: error.stack,
      errorTime: new Date().toISOString(),
    })
  }
}
