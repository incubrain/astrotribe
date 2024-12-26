// src/core/services/scraper.service.ts
import { Browser, chromium, Page, type LaunchOptions, BrowserContext } from 'playwright'
import { CustomLogger } from '@core'

const defaultLaunchOptions: LaunchOptions = {
  headless: true,
  args: [
    '--headless=new',
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-backgrounding-occluded-windows',
    '--disable-breakpad',
    '--disable-client-side-phishing-detection',
    '--disable-default-apps',
    '--disable-features=site-per-process',
    '--disable-hang-monitor',
    '--disable-ipc-flooding-protection',
    '--disable-prompt-on-repost',
    '--disable-renderer-backgrounding',
    '--disable-sync',
    '--metrics-recording-only',
    '--no-default-browser-check',
    '--password-store=basic',
    '--use-mock-keychain',
    '--js-flags=--max-old-space-size=4096',
    '--max-old-space-size=4096',
  ],
  timeout: 60000, // Increased timeout
}

export class ScraperService {
  private browser: Browser | null = null
  private contexts: Map<string, BrowserContext> = new Map()
  private pages: Map<string, Page> = new Map()
  private readonly DEFAULT_TIMEOUT = 60000
  private isInitializing = false
  private initPromise: Promise<void> | null = null

  constructor(
    private readonly logger: CustomLogger,
    private readonly options: LaunchOptions = {},
  ) {
    this.logger.setDomain('scraper')
  }

  async init(): Promise<void> {
    // Prevent multiple simultaneous initialization attempts
    if (this.initPromise) {
      return this.initPromise
    }

    if (this.browser) {
      this.logger.debug('Browser already initialized')
      return
    }

    this.isInitializing = true
    this.initPromise = this._init()

    try {
      await this.initPromise
    } finally {
      this.isInitializing = false
      this.initPromise = null
    }
  }

  private async _init(): Promise<void> {
    try {
      this.logger.info('Starting browser initialization')

      const mergedOptions = {
        ...defaultLaunchOptions,
        ...this.options,
      }

      this.browser = await chromium.launch(mergedOptions)

      // Set up error handlers
      this.browser.on('disconnected', () => {
        this.logger.error('Browser disconnected unexpectedly', {})
        this.browser = null
      })

      this.logger.info('Browser initialized successfully', {
        options: mergedOptions,
      })
    } catch (error: any) {
      this.browser = null
      this.logger.error('Failed to initialize browser', {
        error: error.message,
        context: this.options,
      })
      throw error
    }
  }

  async getContext(id: string): Promise<BrowserContext> {
    if (!this.contexts.has(id)) {
      try {
        if (!this.browser) {
          await this.init()
        }

        const context = await this.browser!.newContext({
          locale: 'en-US',
          extraHTTPHeaders: {
            'Accept-Language': 'en-US,en;q=0.9',
          },
          userAgent:
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          javaScriptEnabled: true,
          bypassCSP: true,
          viewport: { width: 1920, height: 1080 },
          deviceScaleFactor: 1,
        })

        // Only load necessary resources
        await context.route('**/*', (route) => {
          const resourceType = route.request().resourceType()
          if (resourceType === 'document' || resourceType === 'script') {
            return route.continue()
          }
          return route.abort()
        })

        this.contexts.set(id, context)
        this.logger.debug(`Created new context: ${id}`)
      } catch (error: any) {
        this.logger.error(`Failed to create context: ${id}`, { error })
        throw error
      }
    }
    return this.contexts.get(id)!
  }

  async newPage(contextId = 'default'): Promise<Page> {
    try {
      const context = await this.getContext(contextId)
      const page = await context.newPage()

      // Set up page configurations
      await this.configureNewPage(page)

      this.pages.set(`${contextId}:${page.url()}`, page)
      return page
    } catch (error: any) {
      this.logger.error('Failed to create new page', { error })
      throw error
    }
  }

  private async configureNewPage(page: Page): Promise<void> {
    // Set default timeout
    page.setDefaultTimeout(this.DEFAULT_TIMEOUT)

    // Error handling
    page.on('pageerror', (error) => {
      this.logger.error('Page error occurred', { error })
    })

    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        this.logger.error('Console error from page', { context: { message: msg.text() } })
      }
    })

    page.on('crash', () => {
      this.logger.error('Page crashed', { context: { url: page.url() } })
    })

    // Set viewport and headers
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
      'Accept-Language': 'en-US,en;q=0.9',
    })
  }

  async navigateWithRetry(page: Page, url: string, maxRetries = 3): Promise<void> {
    let lastError

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.DEFAULT_TIMEOUT,
        })

        if (!response) {
          throw new Error('Navigation resulted in null response')
        }

        if (!response.ok()) {
          throw new Error(`Navigation failed with status ${response.status()}`)
        }

        return
      } catch (error: any) {
        lastError = error
        this.logger.warn(`Navigation attempt ${attempt} failed`, {
          url,
          error: error.message,
          attempt,
          maxRetries,
        })

        if (attempt === maxRetries) break

        // Exponential backoff
        await new Promise((resolve) =>
          setTimeout(resolve, Math.min(1000 * Math.pow(2, attempt - 1), 10000)),
        )
      }
    }

    throw lastError
  }

  async cleanup(): Promise<void> {
    try {
      // Close all contexts first
      for (const [id, context] of this.contexts) {
        try {
          await context.close()
          this.contexts.delete(id)
        } catch (error: any) {
          this.logger.warn(`Failed to close context ${id}`, { error })
        }
      }

      // Then close the browser
      if (this.browser) {
        await this.browser.close()
        this.browser = null
      }

      this.pages.clear()
      this.logger.info('Cleanup completed successfully')
    } catch (error: any) {
      this.logger.error('Error during cleanup', { error })
      throw error
    }
  }

  async isHealthy(): Promise<boolean> {
    if (!this.browser || this.isInitializing) {
      return false
    }

    try {
      const context = await this.getContext('health-check')
      const page = await context.newPage()
      await page.close()
      await context.close()
      return true
    } catch (error: any) {
      this.logger.error('Health check failed', { error })
      return false
    }
  }

  getStats(): { contexts: number; pages: number } {
    return {
      contexts: this.contexts.size,
      pages: this.pages.size,
    }
  }
}
