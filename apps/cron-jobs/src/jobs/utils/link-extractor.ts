// newsLinkExtractor.ts
import { Page } from 'playwright'
import robotsParser from 'robots-parser'
import Parser from 'rss-parser'
import pLimit from 'p-limit'
import { CustomLogger, PrismaService } from '@core'
import { ContentSource } from '@types'
import { logFile } from '@helpers'
import { URLFormatter } from './url-formatter'
import { UrlClassifier } from './url-classifier'
import { ContentStash, globalContentStash } from './content-stash'
import fetch from 'node-fetch'

interface ClassifiedUrl {
  url: string
  predicted_category: string
  created_at: string
}

export class NewsLinkExtractor {
  private readonly REQUEST_TIMEOUT = 10000
  private readonly MAX_CONCURRENT = 5
  private readonly parser: Parser

  private contentStash: ContentStash
  private domain: string
  private classifier: UrlClassifier
  private processedUrls = new Set<string>()
  private classifiedUrls: ClassifiedUrl[] = []

  constructor(
    private readonly page: Page | null,
    private readonly source: ContentSource,
    private readonly services: {
      logger: CustomLogger
      prisma: PrismaService
    },
  ) {
    this.domain = new URL(source.url).hostname
    this.contentStash = globalContentStash
    this.classifier = new UrlClassifier()
    this.parser = new Parser({
      timeout: this.REQUEST_TIMEOUT,
      headers: { 'User-Agent': 'NewsBot/1.0 (Astrotribe RSS Fetcher)' },
    })

    this.services.logger.info(`Initialized NewsLinkExtractor for source: ${source.url}`)
  }

  public async extractLinks(): Promise<any[]> {
    const { logger } = this.services

    // First try RSS feeds if available
    if (this.source.rss_urls?.length) {
      logger.info('RSS feeds found, attempting RSS extraction first', {
        feedCount: this.source.rss_urls.length,
        feeds: this.source.rss_urls,
      })

      try {
        const rssItems = await this.extractFromRSSFeeds()
        if (rssItems.length > 0) {
          logger.info('Successfully extracted items from RSS feeds', {
            itemCount: rssItems.length,
            samples: rssItems.slice(0, 3).map((item) => ({
              title: item.title,
              link: item.link,
            })),
          })
          return this.createBlogPostObjects(rssItems)
        }
        logger.warn('No items found in RSS feeds, falling back to HTML scraping')
      } catch (error: any) {
        logger.error('RSS extraction failed, falling back to HTML scraping', { error })
      }
    }

    // Fallback to HTML scraping if we have a page
    if (!this.page) {
      logger.warn('No page provided for HTML scraping')
      return []
    }

    logger.info('Starting HTML scraping')
    const urls = await this.extractAllLinks()
    const validUrls = await this.filterAndClassifyUrls(urls)
    return this.createBlogPostObjects(validUrls)
  }

  private async filterAndClassifyUrls(urls: string[]): Promise<string[]> {
    const { logger } = this.services
    const extractedUrls: string[] = []
    const limit = pLimit(this.MAX_CONCURRENT)

    await Promise.all(
      urls.map((url) =>
        limit(async () => {
          if (this.processedUrls.has(url)) return
          this.processedUrls.add(url)

          try {
            if (!this.isSameDomain(url) || !(await this.isScrapingAllowed(url))) {
              return
            }

            if (await this.isBlogPost(url)) {
              extractedUrls.push(url)
              this.contentStash.addValidBlogUrl(new URL(url).hostname, url)
            }
          } catch (error: any) {
            logger.error(`Error processing URL: ${url}`, { error })
          }
        }),
      ),
    )

    await this.storeClassificationsInBulk()
    return extractedUrls
  }

  private async extractFromRSSFeeds(): Promise<any[]> {
    const { logger } = this.services
    const limit = pLimit(this.MAX_CONCURRENT)

    const feedPromises = (this.source.rss_urls || []).filter(Boolean).map((rssUrl) =>
      limit(async () => {
        try {
          logger.debug(`Fetching RSS feed: ${rssUrl}`)
          const feed = await this.fetchRSSWithTimeout(rssUrl)

          if (feed?.items?.length) {
            logger.info(`Successfully fetched RSS feed: ${rssUrl}`, {
              itemCount: feed.items.length,
            })
            return feed.items
          }

          logger.warn(`No items found in RSS feed: ${rssUrl}`)
          return []
        } catch (error: any) {
          logger.error(`Failed to fetch RSS feed: ${rssUrl}`, { error })
          return []
        }
      }),
    )

    const feeds = await Promise.all(feedPromises)
    return feeds
      .flat()
      .filter(
        (item, index, self) => item.link && index === self.findIndex((i) => i.link === item.link),
      )
  }

  private async fetchRSSWithTimeout(url: string): Promise<any> {
    try {
      return await Promise.race([
        this.parser.parseURL(url),
        new Promise((_, reject) =>
          setTimeout(
            () => reject(new Error(`RSS fetch timeout after ${this.REQUEST_TIMEOUT}ms`)),
            this.REQUEST_TIMEOUT,
          ),
        ),
      ])
    } catch (error: any) {
      this.services.logger.error(`RSS fetch failed for ${url}`, { error })
      throw error
    }
  }

  private async storeClassificationsInBulk(): Promise<void> {
    try {
      if (this.classifiedUrls.length === 0) {
        return
      }

      await this.services.prisma.$transaction(async (tx) => {
        // Process in chunks to avoid overwhelming the database
        const chunkSize = 100
        for (let i = 0; i < this.classifiedUrls.length; i += chunkSize) {
          const chunk = this.classifiedUrls.slice(i, i + chunkSize)

          await tx.classifiedUrls.createMany({
            data: chunk.map((url) => ({
              url: url.url,
              predicted_category: url.predicted_category as any,
              created_at: url.created_at || new Date(),
            })),
            skipDuplicates: true,
          })

          // Update existing records that might have been skipped
          await Promise.all(
            chunk.map((url) =>
              tx.classifiedUrls
                .update({
                  where: { url: url.url },
                  data: {
                    predicted_category: url.predicted_category as any,
                    updated_at: new Date(),
                  },
                })
                .catch((error: any) => {
                  this.services.logger.warn(`Failed to update URL: ${url.url}`, { error })
                }),
            ),
          )
        }
      })

      this.services.logger.info(`Processed ${this.classifiedUrls.length} classifications in bulk`)
      this.classifiedUrls = [] // Clear the array after processing
    } catch (error: any) {
      this.services.logger.error('Error processing classifications in bulk', {
        ...error,
        urlCount: this.classifiedUrls.length,
      })
      throw error
    }
  }

  public async extractBlogLinks(): Promise<string[]> {
    let rss
    if (this.source.rss_urls && this.source.rss_urls.length) {
      this.services.logger.info('RSS URLs found, attempting to extract from RSS feed', {
        rssUrls: this.source.rss_urls,
      })
      rss = await this.extractRSSFeed()
    }

    if (rss) {
      this.services.logger.info('Successfully extracted from RSS feed', {
        itemCount: rss.length,
        sampleItems: rss.slice(0, 3).map((item) => ({
          title: item.title,
          link: item.link,
          date: item.isoDate,
        })),
      })
      return this.createBlogPostObjects(rss)
    }

    this.services.logger.info('No RSS feed or RSS extraction failed, falling back to HTML scraping')
    const urls = await this.extractAllLinks()
    this.services.logger.info(`Extracted ${urls.length} links from HTML`, {
      sampleUrls: urls.slice(0, 5),
    })

    const startTime = performance.now()
    const extractedUrls: string[] = []
    const limit = pLimit(5) // Limit to 5 concurrent operations

    await Promise.all(
      urls.map((url) =>
        limit(async () => {
          if (this.processedUrls.has(url)) {
            this.services.logger.debug(`Skipping already processed URL: ${url}`)
            return
          }
          this.processedUrls.add(url)

          const extractionStartTime = performance.now()

          if (!this.isSameDomain(url)) {
            this.services.logger.debug(`URL is on a different domain: ${url}`, {
              sourceDomain: this.domain,
              urlDomain: new URL(url).hostname,
            })
            logFile('excluded_urls', { url, reason: 'Different domain' })
            return
          }

          const isAllowed = await this.isScrapingAllowed(url)
          if (!isAllowed) {
            this.services.logger.warn(`Scraping disallowed for URL: ${url}`)
            logFile('news/excluded_urls', {
              url,
              reason: 'Scraping disallowed',
            })
            return
          }

          const isBlogPost = await this.isBlogPost(url)
          if (isBlogPost) {
            extractedUrls.push(url)
            this.contentStash.addValidBlogUrl(new URL(url).hostname, url)
            logFile('news/extracted_urls', url)
            this.services.logger.info(`URL identified as blog post: ${url}`, {
              extractionTime: performance.now() - extractionStartTime,
              totalExtracted: extractedUrls.length,
            })
          } else {
            this.services.logger.debug(`URL is not an article: ${url}`, {
              extractionTime: performance.now() - extractionStartTime,
            })
            logFile('news/excluded_urls', { url, reason: 'Not an article' })
          }

          const extractionTime = performance.now() - extractionStartTime
          this.services.logger.debug(`URL processing complete: ${url}`, {
            extractionTime: extractionTime.toFixed(2),
            isArticle: isBlogPost,
          })
        }),
      ),
    )

    const endTime = performance.now()
    const totalTime = endTime - startTime

    this.services.logger.info('Link extraction completed', {
      totalTime: totalTime.toFixed(2),
      totalUrls: urls.length,
      extractedUrls: extractedUrls.length,
      sampleExtractedUrls: extractedUrls.slice(0, 5),
    })

    await this.storeClassificationsInBulk()

    const blogPosts = this.createBlogPostObjects(extractedUrls)
    this.services.logger.info('Blog post objects created', {
      count: blogPosts.length,
      samplePosts: blogPosts.slice(0, 3).map((post) => ({
        url: post.contents.url,
        title: post.news.title,
        publishedAt: post.news.published_at,
      })),
    })

    return blogPosts
  }

  private async isBlogPost(url: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname.toLowerCase()

      if (this.isExcludedLink(pathname)) {
        this.services.logger.debug(`URL excluded by pattern: ${url}`)
        logFile('news/excluded_urls', { url, reason: 'Excluded pattern' })
        return false
      }

      if (this.containsArticleIndicators(pathname)) {
        this.services.logger.debug(`URL contains article indicators: ${url}`)
        return true
      }

      // Use ML classifier
      const category = await this.classifier.predict(url)
      const isArticle = category === 'news'

      this.classifiedUrls.push({
        url,
        predicted_category: category,
        created_at: new Date().toISOString(),
      })

      if (isArticle) {
        this.services.logger.debug(`Classifier accepted URL: ${url}, category: ${category}`)
        logFile('news/extracted_urls', {
          url,
          reason: 'Classifier Accepted',
          category,
        })
      } else {
        this.services.logger.verbose(`Classifier rejected URL: ${url}, category: ${category}`)
        logFile('news/excluded_urls', {
          url,
          reason: 'Classifier rejected',
          category,
        })
      }
      return isArticle
    } catch (error: any) {
      this.services.logger.error(`Error in isBlogPost for URL: ${url}`, error)
      logFile('news/excluded_urls', { url, reason: 'Error in isBlogPost' })
      return false
    }
  }

  private createBlogPostObjects(urls: string[] | any[]): any[] {
    const blogPosts = urls.map((url) => {
      const featured_image =
        url?.['content:encoded']?.match(/<img[^>]+src="([^">]+)"/)?.[1] || url?.enclosure?.url

      return {
        contents: {
          url: (url.hasOwnProperty('link') && url.link) || url,
          content_type: 'news',
        },
        news: {
          url: (url.hasOwnProperty('link') && url.link) || url,
          author: url?.creator || url?.['dc:creator'],
          title: url?.title,
          featured_image,
          body: url?.['content:encodedSnippet'],
          description: url?.contentSnippet,
          published_at: url?.isoDate,
          keywords: url ? { values: url?.categories } : null,
          company_id: this.source.company_id,
          scraped_at: new Date().toISOString(),
          failed_count: 0,
          scrape_frequency: 'weekly',
        },
      }
    })

    return blogPosts
  }

  private isExcludedLink(pathname: string): boolean {
    const exclusions = [
      '/category/',
      '/tag/',
      '/tags/',
      '/author/',
      '/page/',
      '/search/',
      '/feed',
      '/archive',
      '/archives',
      '/archive.html',
      '/section/',
      '/event',
      '/events',
      '/contact',
      '/about',
      '/media-contacts',
      '/all-news',
      '/news/all-news',
      '/news/media-contacts',
      '/news/press-releases',
      '/newsletter',
      '/subscribe',
      '/signup',
      '/login',
      '/register',
      '/sitemap',
      '/issues/',
      '/picture-of-the-day/',
      '/what-we-do/',
      '/resources/',
    ]

    // Exclude URLs that end with a date pattern like /YYYY, /YYYY/, /YYYY/MM, or /MM
    const datePattern = /\/(\d{4}(\/\d{2})?\/?)$|\/\d+$/

    // Exclude base URL (root path)
    const isRootPath = pathname === '/' || pathname === ''

    // Get the last segment of the path
    const pathSegments = pathname.split('/').filter(Boolean)
    const lastSegment = pathSegments[pathSegments.length - 1] || ''

    // Exclude URLs with less than 3 hyphens in the last segment
    const hyphenCount = (lastSegment.match(/-/g) || []).length
    const hasFewHyphensInLastSegment = hyphenCount < 3

    const isExcluded =
      isRootPath ||
      hasFewHyphensInLastSegment ||
      exclusions.some((exclusion) => pathname.includes(exclusion)) ||
      datePattern.test(pathname)

    this.services.logger.debug(
      `isExcludedLink check for pathname: ${pathname}, result: ${isExcluded}`,
    )

    return isExcluded
  }

  private containsArticleIndicators(pathname: string): boolean {
    const articleIndicators = [
      /\/blogs?\//, // Matches /blog/ or /blogs/
      /\/news\//, // Matches /news/ or /newses/
      /\/articles?\//, // Matches /article/ or /articles/
      /\/posts?\//, // Matches /post/ or /posts/
      /\/stor(y|ies)\//, // Matches /story/ or /stories/
      /\/20\d{2}/, // Matches years from 2000 to 2099
    ]

    const hasIndicators = articleIndicators.some((indicator) =>
      indicator.test(pathname.toLowerCase()),
    )

    this.services.logger.debug(
      `containsArticleIndicators check for pathname: ${pathname}, result: ${hasIndicators}`,
    )

    return hasIndicators
  }

  private isSameDomain(url: string): boolean {
    const baseDomain = this.getBaseDomain(this.source.url)
    const urlDomain = this.getBaseDomain(url)

    // Allow subdomains of the base domain
    const isSame = urlDomain.endsWith(baseDomain)
    this.services.logger.debug(
      `isSameDomain check: baseDomain=${baseDomain}, urlDomain=${urlDomain}, result=${isSame}`,
    )

    return isSame
  }

  private getBaseDomain(url: string): string {
    const hostname = new URL(url).hostname
    const parts = hostname.split('.').slice(-2)
    const baseDomain = parts.join('.')

    this.services.logger.debug(`getBaseDomain for URL: ${url}, baseDomain: ${baseDomain}`)

    return baseDomain
  }

  private async extractRSSFeed() {
    const parser = new Parser()
    const maxRetries = 3
    const failedCounts: Record<string, number> = {}

    // Initialize pLimit with maximum concurrent tasks
    const limit = pLimit(this.MAX_CONCURRENT)

    // Create an array of limited promises

    const promises = (this.source.rss_urls || [])
      .filter(Boolean)
      .map((rss_url) =>
        limit(() => this.parseRSSWithRetries(rss_url, maxRetries, failedCounts, parser)),
      )

    const feeds = await Promise.all(promises)

    // Flatten and filter the results
    return feeds
      .flat()
      .filter(
        (item, index, self) => item.title && index === self.findIndex((o) => o.link === item.link),
      )
  }

  private async parseRSSWithRetries(
    rss_url: string,
    maxRetries: number,
    failedCounts: Record<string, number>,
    parser: Parser,
  ): Promise<any[]> {
    let retries = 0
    const items: any[] = []
    const startTime = performance.now()

    while (retries < maxRetries) {
      try {
        const feed = await this.parseURLWithTimeout(parser, rss_url)

        if (feed?.items?.length > 0) {
          items.push(...feed.items)
          const duration = performance.now() - startTime

          this.services.logger.info(
            `Successfully processed feed from ${rss_url} in ${duration.toFixed(2)}ms`,
          )
          return items
        } else {
          this.services.logger.warn(`No items found in feed from ${rss_url}`)
          const duration = performance.now() - startTime
          this.services.logger.info(
            `Processed feed from ${rss_url} (no items) in ${duration.toFixed(2)}ms`,
          )
          return []
        }
      } catch (error: any) {
        retries++
        failedCounts[rss_url] = (failedCounts[rss_url] || 0) + 1

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        this.services.logger.error(`RSS Parse Error for ${rss_url}`, {
          ...error,
          message: `Error occurred on ${retries} attempt while parsing RSS: ${errorMessage}`,
        })

        if (retries === maxRetries) {
          const duration = performance.now() - startTime
          this.services.logger.error('Failed to fetch', {
            context: {
              message:
                `Max retries reached for ${rss_url}. Failed ${failedCounts[rss_url]} times. ` +
                `Total processing time: ${duration.toFixed(2)}ms`,
            },
          })
        }
      }
    }

    const duration = performance.now() - startTime
    this.services.logger.info(`Processed feed from ${rss_url} in ${duration.toFixed(2)}ms`)

    return items
  }

  private async parseURLWithTimeout(parser: Parser, url: string): Promise<any> {
    return Promise.race([
      parser.parseURL(url),
      new Promise((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout after ${this.REQUEST_TIMEOUT}ms`)),
          this.REQUEST_TIMEOUT,
        ),
      ),
    ])
  }

  private async extractAllLinks(): Promise<string[]> {
    this.services.logger.debug('Starting link extraction from page')

    try {
      // Wait for content to load
      await this.page?.waitForLoadState('domcontentloaded')

      // First try specific content areas
      const contentSelectors = [
        'main',
        '[role="main"]',
        '[class*="content"]',
        'article',
        '.news-content',
        '.article-content',
        '.post-content',
        '#content',
      ].join(', ')

      // Check if main content exists
      const mainContent = this.page?.locator(contentSelectors)
      const mainContentCount = await mainContent?.count()

      this.services.logger.debug(`Found ${mainContentCount} main content areas`)

      let links: string[] = []

      if (!!mainContentCount && mainContentCount > 0) {
        // Extract links within main content
        links = (await mainContent?.evaluateAll((nodes) => {
          const hrefs = new Set<string>()
          nodes.forEach((node) => {
            const anchorTags = node.querySelectorAll('a[href]')
            anchorTags.forEach((a) => {
              const href = (a as HTMLAnchorElement).href
              if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
                hrefs.add(href)
              }
            })
          })
          return Array.from(hrefs)
        })) as string[]

        this.services.logger.info(`Extracted ${links.length} links from main content areas`, {
          sampleLinks: links.slice(0, 5),
        })
      } else {
        // Fallback: Extract all links
        this.services.logger.warn('No main content found, falling back to whole page extraction')

        // Wait for any dynamic content
        await this.page?.waitForLoadState('networkidle')

        links = (await this.page?.evaluate(() => {
          const hrefs = new Set<string>()
          document.querySelectorAll('a[href]').forEach((a) => {
            const href = (a as HTMLAnchorElement).href
            if (href && !href.startsWith('javascript:') && !href.startsWith('#')) {
              hrefs.add(href)
            }
          })
          return Array.from(hrefs)
        })) as string[]

        this.services.logger.info(`Extracted ${links.length} links from entire page`, {
          sampleLinks: links.slice(0, 5),
        })
      }

      // Format and validate URLs
      const { validUrls, contacts } = URLFormatter.formatURLs(
        URLFormatter.getBaseUrl(this.source.url),
        links,
      )

      if (contacts.length > 0) {
        this.services.logger.info(`Found ${contacts.length} contacts during extraction`)
      }

      const uniqueLinks = Array.from(new Set(validUrls))

      this.services.logger.info('Link extraction completed', {
        totalRawLinks: links.length,
        validLinks: validUrls.length,
        contacts: contacts.length,
        uniqueLinks: uniqueLinks.length,
        sampleUniqueLinks: uniqueLinks.slice(0, 5),
      })

      return uniqueLinks
    } catch (error: any) {
      this.services.logger.error('Error extracting links from page', {
        error,
        context: {
          url: this.source.url,
          pageTitle: await this.page?.title(),
        },
      })
      return []
    }
  }

  private async isScrapingAllowed(url: string): Promise<boolean> {
    const baseUrl = new URL(url).origin
    const robotsUrl = `${baseUrl}/robots.txt`
    try {
      const response = await fetch(robotsUrl)
      const robotsTxt = await response.text()
      const robots = robotsParser(robotsUrl, robotsTxt)
      const isAllowed = robots.isAllowed(url, 'YourScraperUserAgent') || false
      this.services.logger.debug(`Robots.txt check for URL: ${url}, isAllowed: ${isAllowed}`)
      return isAllowed
    } catch (error: any) {
      this.services.logger.error(`Error fetching robots.txt from ${robotsUrl}`, error)
      // Default to not scraping if unable to fetch robots.txt
      return false
    }
  }

  public getContentStashStats(): any {
    this.services.logger.debug('Retrieving content stash stats')
    return this.contentStash.getAllStats()
  }
}

export async function scrapeNewsLinks(
  page: Page,
  source: ContentSource,
  services: { logger: CustomLogger; prisma: PrismaService },
): Promise<string[]> {
  console.info('Creating NewsLinkExtractor instance')
  const scraper = new NewsLinkExtractor(page, source, services)
  return scraper.extractBlogLinks()
}
