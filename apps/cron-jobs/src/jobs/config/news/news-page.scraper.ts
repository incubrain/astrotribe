// NewsContentScraper.ts
import type { Page } from 'playwright'
import { CustomLogger, ExtractorModule } from '@core'
import TurndownService from 'turndown'
import { hashContent } from '@helpers'

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

export class NewsContentScraper {
  private readonly turndownService: TurndownService
  private readonly dataExtractor: ExtractorModule
  private readonly selectors = [
    'article',
    '[role="article"]',
    '.post-content',
    '.article-body',
    '#main-content',
    '.main-content',
    'main',
    '.entry-content',
    '#content',
    '.content',
    '.post',
    '.article',
  ]

  constructor(private readonly logger: CustomLogger) {
    this.turndownService = new TurndownService()
    this.dataExtractor = new ExtractorModule(logger)
  }

  async extractContent(page: Page, source: NewsPageData): Promise<NewsPageData> {
    try {
      const html = await page.content()
      const articleHTML = await this.extractArticleContent(page)

      if (!articleHTML || (await this.isDifferentDomain(page, source.url))) {
        this.logger.warn(`No content extracted from ${source.url}`)
        return {
          ...source,
          failed_count: source.failed_count + 1,
        }
      }

      const body = this.turndownService.turndown(articleHTML)
      const publishedAt = source.published_at || this.dataExtractor.extractPublishedDate(html)
      const published_at = publishedAt?.toISOString() ?? publishedAt ?? null
      const title = source.title || this.dataExtractor.extractTitle(html) || ''
      const author = source.author || this.dataExtractor.extractAuthor(html)
      const featured_image =
        source.featured_image || this.dataExtractor.extractFeaturedImage(html, page.url())
      const keywords = source.keywords || this.dataExtractor.extractKeywords(html)

      return {
        ...source,
        body,
        ...(source.title ? {} : { title }),
        ...(source.description ? {} : { description: '' }),
        ...(source.featured_image ? {} : { featured_image }),
        ...(source.author ? {} : { author }),
        ...(source.keywords ? {} : { keywords }),
        ...(source.published_at ? {} : { published_at }),
        hash: hashContent(body),
        scraped_at: new Date().toISOString(),
        failed_count: 0,
      }
    } catch (error: any) {
      this.logger.error('Failed to extract content', { error, context: { url: source.url } })
      return {
        ...source,
        failed_count: source.failed_count + 1,
      }
    }
  }

  private async extractArticleContent(page: Page): Promise<string> {
    for (const selector of this.selectors) {
      try {
        const locator = page.locator(selector)
        const count = await locator.count()

        if (count > 0) {
          return await locator.first().innerHTML()
        }
      } catch (error) {
        this.logger.warn(`Error with selector ${selector}`, { error })
      }
    }

    // Fallback to body content analysis
    try {
      const content = await page.evaluate(() => {
        const possibleContentNodes = Array.from(document.body.children).filter((el) => {
          const text = el.textContent || ''
          return text.length > 500 && text.split(' ').length > 100
        })
        return possibleContentNodes.length > 0
          ? possibleContentNodes.map((node) => node.innerHTML).join('')
          : document.body.innerHTML
      })
      return content
    } catch (error: any) {
      this.logger.error('Error extracting content', { error })
      return ''
    }
  }

  private async isDifferentDomain(page: Page, sourceUrl: string): Promise<boolean> {
    return new URL(page.url()).host !== new URL(sourceUrl).host
  }
}
