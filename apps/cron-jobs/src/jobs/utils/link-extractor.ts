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

interface ClassifiedUrl {
  url: string
  predicted_category: string
  created_at: string
}

export class NewsLinkExtractor {
  private logger = new CustomLogger('NewsLinkExtractor')
  private contentStash: ContentStash
  private domain: string
  private classifier: UrlClassifier
  private processedUrls: Set<string> = new Set()
  private classifiedUrls: ClassifiedUrl[] = []
  private db = new PrismaService(this.logger)
  private readonly REQUEST_TIMEOUT = 10000
  private readonly MAX_CONCURRENT_TASKS = 10

  constructor(
    private page: Page,
    private source: ContentSource,
    batchSize: number = 100,
  ) {
    this.domain = new URL(source.url).hostname
    this.contentStash = globalContentStash
    this.classifier = new UrlClassifier()
    this.logger.info(`Initialized NewsLinkExtractor for domain: ${this.domain}`)
  }

  private async storeClassificationsInBulk(): Promise<void> {
    try {
      if (this.classifiedUrls.length === 0) {
        return
      }

      await this.db.$transaction(async (tx) => {
        // Process in chunks to avoid overwhelming the database
        const chunkSize = 100
        for (let i = 0; i < this.classifiedUrls.length; i += chunkSize) {
          const chunk = this.classifiedUrls.slice(i, i + chunkSize)

          await tx.classified_urls.createMany({
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
              tx.classified_urls
                .update({
                  where: { url: url.url },
                  data: {
                    predicted_category: url.predicted_category as any,
                    updated_at: new Date(),
                  },
                })
                .catch((error: any) => {
                  this.logger.warn(`Failed to update URL: ${url.url}`, { error })
                }),
            ),
          )
        }
      })

      this.logger.info(`Processed ${this.classifiedUrls.length} classifications in bulk`)
      this.classifiedUrls = [] // Clear the array after processing
    } catch (error: any) {
      this.logger.error('Error processing classifications in bulk', {
        ...error,
        urlCount: this.classifiedUrls.length,
      })
      throw error
    }
  }

  public async extractBlogLinks(): Promise<string[]> {
    let rss
    if (this.source.rss_urls && this.source.rss_urls.length) rss = await this.extractRSSFeed()

    if (rss) {
      return this.createBlogPostObjects(rss)
    }

    const urls = await this.extractAllLinks()
    this.logger.info(`Extracted ${urls.length} links`)

    const startTime = performance.now()
    const extractedUrls: string[] = []
    const limit = pLimit(5) // Limit to 5 concurrent operations

    await Promise.all(
      urls.map((url) =>
        limit(async () => {
          if (this.processedUrls.has(url)) {
            return
          }
          this.processedUrls.add(url)

          const extractionStartTime = performance.now()

          if (!this.isSameDomain(url)) {
            this.logger.verbose(`URL is on a different domain: ${url}`)
            logFile('excluded_urls', { url, reason: 'Different domain' })
            return
          }

          const isAllowed = await this.isScrapingAllowed(url)
          if (!isAllowed) {
            this.logger.warn(`Scraping disallowed for URL: ${url}`)
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
            this.logger.debug(`URL added to extracted URLs: ${url}`)
          } else {
            this.logger.verbose(`URL is not an article: ${url}`)
            logFile('news/excluded_urls', { url, reason: 'Not an article' })
          }

          const extractionTime = performance.now() - extractionStartTime

          this.logger.info(`Extraction time for URL ${url}: ${extractionTime.toFixed(2)}ms`)
        }),
      ),
    )

    const endTime = performance.now()
    const totalTime = endTime - startTime

    this.logger.info(
      `Total extraction time: ${totalTime.toFixed(2)}ms for ${extractedUrls.length} URLs`,
    )

    await this.storeClassificationsInBulk()

    return this.createBlogPostObjects(extractedUrls)
  }

  private async isBlogPost(url: string): Promise<boolean> {
    try {
      const parsedUrl = new URL(url)
      const pathname = parsedUrl.pathname.toLowerCase()

      if (this.isExcludedLink(pathname)) {
        this.logger.debug(`URL excluded by pattern: ${url}`)
        logFile('news/excluded_urls', { url, reason: 'Excluded pattern' })
        return false
      }

      if (this.containsArticleIndicators(pathname)) {
        this.logger.debug(`URL contains article indicators: ${url}`)
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
        this.logger.debug(`Classifier accepted URL: ${url}, category: ${category}`)
        logFile('news/extracted_urls', {
          url,
          reason: 'Classifier Accepted',
          category,
        })
      } else {
        this.logger.verbose(`Classifier rejected URL: ${url}, category: ${category}`)
        logFile('news/excluded_urls', {
          url,
          reason: 'Classifier rejected',
          category,
        })
      }
      return isArticle
    } catch (error: any) {
      this.logger.error(`Error in isBlogPost for URL: ${url}`, error)
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

    this.logger.debug(`isExcludedLink check for pathname: ${pathname}, result: ${isExcluded}`)

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

    this.logger.debug(
      `containsArticleIndicators check for pathname: ${pathname}, result: ${hasIndicators}`,
    )

    return hasIndicators
  }

  private isSameDomain(url: string): boolean {
    const baseDomain = this.getBaseDomain(this.source.url)
    const urlDomain = this.getBaseDomain(url)

    // Allow subdomains of the base domain
    const isSame = urlDomain.endsWith(baseDomain)
    this.logger.debug(
      `isSameDomain check: baseDomain=${baseDomain}, urlDomain=${urlDomain}, result=${isSame}`,
    )

    return isSame
  }

  private getBaseDomain(url: string): string {
    const hostname = new URL(url).hostname
    const parts = hostname.split('.').slice(-2)
    const baseDomain = parts.join('.')

    this.logger.debug(`getBaseDomain for URL: ${url}, baseDomain: ${baseDomain}`)

    return baseDomain
  }

  private async extractRSSFeed() {
    const parser = new Parser()
    const maxRetries = 3
    const failedCounts: Record<string, number> = {}

    // Initialize pLimit with maximum concurrent tasks
    const limit = pLimit(this.MAX_CONCURRENT_TASKS)

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

          this.logger.info(
            `Successfully processed feed from ${rss_url} in ${duration.toFixed(2)}ms`,
          )
          return items
        } else {
          this.logger.warn(`No items found in feed from ${rss_url}`)
          const duration = performance.now() - startTime
          this.logger.info(`Processed feed from ${rss_url} (no items) in ${duration.toFixed(2)}ms`)
          return []
        }
      } catch (error: any) {
        retries++
        failedCounts[rss_url] = (failedCounts[rss_url] || 0) + 1

        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        this.logger.error(`RSS Parse Error for ${rss_url}`, {
          ...error,
          message: `Error occurred on ${retries} attempt while parsing RSS: ${errorMessage}`,
        })

        if (retries === maxRetries) {
          const duration = performance.now() - startTime
          this.logger.error(
            'Failed to fetch',
            `Max retries reached for ${rss_url}. Failed ${failedCounts[rss_url]} times. ` +
              `Total processing time: ${duration.toFixed(2)}ms`,
          )
        }
      }
    }

    const duration = performance.now() - startTime
    this.logger.info(`Processed feed from ${rss_url} in ${duration.toFixed(2)}ms`)

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
    // Target main content areas using Playwright's Locator API
    const contentSelectors = 'main, [role="main"], [class*="content"], article'
    const mainContent = this.page.locator(contentSelectors)

    // Check if main content exists
    const mainContentCount = await mainContent.count()
    let links: string[] = []

    if (mainContentCount > 0) {
      // Extract links within main content
      links = await mainContent.evaluateAll((nodes) => {
        const hrefs = new Set<string>()
        nodes.forEach((node) => {
          const anchorTags = node.querySelectorAll('a[href]')
          anchorTags.forEach((a) => hrefs.add((a as HTMLAnchorElement).href))
        })
        return Array.from(hrefs)
      })
      this.logger.debug(`Extracted ${links.length} links from main content`)
    } else {
      // Fallback: Extract all links from the page
      this.logger.warn(
        'Main content selectors not found. Falling back to extract all links from the page.',
      )
      links = await this.page.evaluate(() => {
        const hrefs = new Set<string>()
        const anchorTags = document.querySelectorAll('a[href]')
        anchorTags.forEach((a) => hrefs.add((a as HTMLAnchorElement).href))
        return Array.from(hrefs)
      })
      this.logger.debug(`Extracted ${links.length} links from the entire page`)
    }

    const uniqueLinks = Array.from(
      new Set(URLFormatter.formatURLs(URLFormatter.getBaseUrl(this.source.url), links).validUrls),
    )

    this.logger.info(`Total unique links extracted: ${uniqueLinks.length}`)

    return uniqueLinks
  }

  private async isScrapingAllowed(url: string): Promise<boolean> {
    const baseUrl = new URL(url).origin
    const robotsUrl = `${baseUrl}/robots.txt`
    try {
      const response = await fetch(robotsUrl)
      const robotsTxt = await response.text()
      const robots = robotsParser(robotsUrl, robotsTxt)
      const isAllowed = robots.isAllowed(url, 'YourScraperUserAgent') || false
      this.logger.debug(`Robots.txt check for URL: ${url}, isAllowed: ${isAllowed}`)
      return isAllowed
    } catch (error: any) {
      this.logger.error(`Error fetching robots.txt from ${robotsUrl}`, error)
      // Default to not scraping if unable to fetch robots.txt
      return false
    }
  }

  public getContentStashStats(): any {
    this.logger.debug('Retrieving content stash stats')
    return this.contentStash.getAllStats()
  }
}

export async function scrapeNewsLinks(
  page: Page,
  source: ContentSource,
  batchSize: number = 100,
): Promise<string[]> {
  this.logger.info('Creating NewsLinkExtractor instance')
  const scraper = new NewsLinkExtractor(page, source, batchSize)
  return scraper.extractBlogLinks()
}
