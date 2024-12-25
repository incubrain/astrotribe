// src/infrastructure/scraper/scraper.service.ts
import { Browser, chromium, Page } from 'playwright'
import { CustomLogger } from '@core'

export class ScraperService {
  private browser: Browser | null = null

  constructor(private readonly logger: CustomLogger) {}

  async init() {
    try {
      this.browser = await chromium.launch({
        headless: true,
      })
      this.logger.info('Browser initialized')
    } catch (error: any) {
      this.logger.error('Failed to initialize browser', error)
      throw error
    }
  }

  async newPage(): Promise<Page> {
    if (!this.browser) {
      await this.init()
    }
    return this.browser!.newPage()
  }

  async cleanup() {
    if (this.browser) {
      await this.browser.close()
      this.browser = null
    }
  }
}
