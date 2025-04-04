// src/index.ts
import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import { time } from 'console'
import type { Browser, Page, BrowserContext } from 'playwright'
import { chromium, firefox, webkit, errors } from 'playwright'
import { parseStringPromise } from 'xml2js'
import { createLogger, format, transports } from 'winston'

// Enhanced error interface for better typing
interface EnhancedLogEntry {
  type: string
  text: string
  stack?: string
  errorType?: string
  location?: {
    url?: string
    line?: number
    column?: number
    sourceUrl?: string
  }
  timestamp: string
  severity?: string
  category?: string
}

interface FailedRequest {
  url: string
  method: string
  resourceType: string
  errorText: string
  status?: number
  timestamp: string
  headers?: Record<string, string>
}

interface PageResult {
  url: string
  title: string
  status: 'success' | 'error'
  error?: string
  logs: EnhancedLogEntry[]
  failedRequests: FailedRequest[]
  screenshot: string
  timestamp: string
  performanceMetrics?: any
  jsCoverage?: any
  cssCoverage?: any
}

interface CrawlOptions {
  startUrl: string
  outputDir: string
  maxPages?: number
  screenshotHeight?: number
  includeResources?: boolean
  logResourceContent?: boolean
  headless?: boolean
  timeout?: number
  browser?: 'chromium' | 'firefox' | 'webkit'
  debug?: boolean
  captureAllLogs?: boolean
}

// Setup logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`
    }),
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.timestamp(),
        format.printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`
        }),
      ),
    }),
    new transports.File({ filename: 'crawler.log' }),
  ],
})

class WebsiteCrawler {
  private visitedUrls: Set<string> = new Set()
  private pendingUrls: string[] = []
  private baseUrl: string = ''
  private options: Required<CrawlOptions>
  private results: PageResult[] = []
  private browser?: Browser
  private context?: BrowserContext

  constructor(options: CrawlOptions) {
    this.options = {
      maxPages: 100,
      screenshotHeight: 1200,
      includeResources: false,
      logResourceContent: false,
      headless: true,
      timeout: 30000,
      browser: 'chromium',
      debug: false,
      captureAllLogs: false,
      ...options,
    }

    try {
      const url = new URL(options.startUrl)
      this.baseUrl = `${url.protocol}//${url.hostname}:${url.port}`
    } catch (error) {
      throw new Error(`Invalid start URL: ${options.startUrl}`)
    }

    // Create output directory
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true })
    }
  }

  public async crawl(): Promise<void> {
    try {
      // First try to get sitemap.xml for a list of URLs
      const sitemapUrls = await this.getSitemapUrls()

      if (sitemapUrls.length > 0) {
        logger.info(`Found ${sitemapUrls.length} URLs in sitemap`)
        this.pendingUrls = [...sitemapUrls]
      } else {
        // If no sitemap, start with the initial URL
        logger.info('No sitemap found, starting with initial URL')
        this.pendingUrls = [this.options.startUrl]
      }

      // Launch browser
      await this.launchBrowser()

      // Process URLs until we reach the limit or run out of URLs
      let processedCount = 0
      while (this.pendingUrls.length > 0 && processedCount < this.options.maxPages) {
        const url = this.pendingUrls.shift()!

        if (this.visitedUrls.has(url)) {
          continue
        }

        logger.info(`Processing ${url} (${processedCount + 1}/${this.options.maxPages})`)

        await this.processUrl(url)
        this.visitedUrls.add(url)
        processedCount++
      }

      // Close browser
      await this.closeBrowser()

      // Write summary
      const summaryPath = path.join(this.options.outputDir, 'summary.json')
      fs.writeFileSync(
        summaryPath,
        JSON.stringify(
          {
            startUrl: this.options.startUrl,
            totalPagesVisited: this.visitedUrls.size,
            timestamp: new Date().toISOString(),
            results: this.results,
          },
          null,
          2,
        ),
      )

      logger.info(
        `Crawling complete. Visited ${this.visitedUrls.size} URLs. Summary written to ${summaryPath}`,
      )
    } catch (error) {
      logger.error(`Crawling failed: ${error instanceof Error ? error.message : String(error)}`)

      // Make sure to close the browser
      await this.closeBrowser()

      throw error
    }
  }

  private async launchBrowser(): Promise<void> {
    try {
      logger.info(`Launching ${this.options.browser} browser (headless: ${this.options.headless})`)

      // More specific launch options to avoid common issues
      const launchOptions = {
        headless: this.options.headless,
        args: [
          '--disable-dev-shm-usage', // Prevents crashes in Docker
          '--no-sandbox', // Required for some environments
          '--disable-setuid-sandbox',
        ],
        timeout: 30000, // 30 seconds to launch browser
      }

      if (this.options.debug) {
        // Use debug logging and slower timeouts
        launchOptions.timeout = 60000
        logger.info('Debug mode enabled - using extended timeouts')
      }

      // Choose browser based on options
      switch (this.options.browser) {
        case 'firefox':
          this.browser = await firefox.launch(launchOptions)
          break
        case 'webkit':
          this.browser = await webkit.launch(launchOptions)
          break
        case 'chromium':
        default:
          this.browser = await chromium.launch(launchOptions)
          break
      }

      if (!this.browser) {
        throw new Error(`Failed to launch ${this.options.browser} browser`)
      }

      // Create a context with viewport for screenshots
      this.context = await this.browser.newContext({
        viewport: { width: 1280, height: this.options.screenshotHeight },
        acceptDownloads: false,
        bypassCSP: true, // Avoid security policy blocking our scripts
        ignoreHTTPSErrors: true, // Avoid SSL issues
      })

      logger.info(`Successfully launched ${this.options.browser} browser`)
    } catch (error) {
      logger.error(
        `Failed to launch browser: ${error instanceof Error ? error.message : String(error)}`,
      )

      // Additional diagnostic info
      if (error instanceof Error) {
        logger.error(`Stack trace: ${error.stack}`)
      }

      throw error
    }
  }

  private async closeBrowser(): Promise<void> {
    try {
      if (this.browser) {
        await this.browser.close()
        this.browser = undefined
        this.context = undefined
        logger.info('Browser closed')
      }
    } catch (error) {
      logger.error(
        `Error closing browser: ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  private async getSitemapUrls(): Promise<string[]> {
    try {
      const sitemapUrl = `${this.baseUrl}/__sitemap__/main.xml`
      logger.info(`Trying to fetch sitemap from ${sitemapUrl}`)

      const response = await fetch(sitemapUrl)

      if (!response.ok) {
        logger.warn(`Sitemap not found at ${sitemapUrl}`)
        return []
      }

      const sitemapContent = await response.text()
      const parsedSitemap = await parseStringPromise(sitemapContent)

      const urls: string[] = []

      if (parsedSitemap.urlset && parsedSitemap.urlset.url) {
        parsedSitemap.urlset.url.forEach((urlEntry: any) => {
          if (urlEntry.loc && urlEntry.loc[0]) {
            urls.push(urlEntry.loc[0])
          }
        })
      }

      return urls
    } catch (error) {
      logger.warn(
        `Error fetching sitemap: ${error instanceof Error ? error.message : String(error)}`,
      )
      return []
    }
  }

  /**
   * Extracts the JavaScript error type from an error message or stack
   */
  private extractErrorType(message: string): string {
    const errorTypes = [
      'TypeError',
      'ReferenceError',
      'SyntaxError',
      'RangeError',
      'URIError',
      'EvalError',
      'InternalError',
      'AggregateError',
      'NetworkError',
    ]

    for (const errorType of errorTypes) {
      if (message.includes(`${errorType}:`)) {
        return errorType
      }
    }

    return 'Error' // Default error type
  }

  /**
   * Extracts line number from a stack trace
   */
  private extractLineNumber(stack: string): number | undefined {
    const lineMatch = stack.match(/:(\d+):\d+/)
    if (lineMatch && lineMatch[1]) {
      return parseInt(lineMatch[1], 10)
    }
    return undefined
  }

  /**
   * Extracts column number from a stack trace
   */
  private extractColumnNumber(stack: string): number | undefined {
    const colMatch = stack.match(/:\d+:(\d+)/)
    if (colMatch && colMatch[1]) {
      return parseInt(colMatch[1], 10)
    }
    return undefined
  }

  /**
   * Creates organized directory structure based on URL
   */
  private createPageDirectory(url: string): string {
    try {
      const urlObj = new URL(url)

      // Create domain directory first
      const domainDir = path.join(this.options.outputDir, urlObj.hostname)
      if (!fs.existsSync(domainDir)) {
        fs.mkdirSync(domainDir, { recursive: true })
      }

      // Parse the path and create directories accordingly
      let pathSegments = urlObj.pathname
        .split('/')
        .filter((segment) => segment.trim() !== '')
        .map((segment) => this.sanitizeFilename(segment))

      // If no path segments, use 'home' as default
      if (pathSegments.length === 0) {
        pathSegments = ['home']
      }

      // Join all path segments
      const pathDir = path.join(domainDir, ...pathSegments)

      // Create the directory if it doesn't exist
      if (!fs.existsSync(pathDir)) {
        fs.mkdirSync(pathDir, { recursive: true })
      }

      return pathDir
    } catch (error) {
      logger.error(
        `Error creating directory for ${url}: ${error instanceof Error ? error.message : String(error)}`,
      )

      // Fallback to a simplified approach
      const sanitizedUrl = this.sanitizeFilename(url)
      const fallbackDir = path.join(this.options.outputDir, sanitizedUrl)

      if (!fs.existsSync(fallbackDir)) {
        fs.mkdirSync(fallbackDir, { recursive: true })
      }

      return fallbackDir
    }
  }

  private async processUrl(url: string): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized')
    }

    const pageResult: PageResult = {
      url,
      title: '',
      status: 'success',
      logs: [],
      failedRequests: [],
      screenshot: '',
      timestamp: new Date().toISOString(),
    }

    let page: Page | null = null

    try {
      // Create directory for this page
      const pageDir = this.createPageDirectory(url)

      // Create a new page
      page = await this.context.newPage()

      const logFilter = this.options.captureAllLogs
        ? ['log', 'info', 'debug', 'warn', 'error']
        : ['warn', 'error']

      // Enhanced console log collection with better typing
      page.on('console', (msg) => {
        if (!logFilter.includes(msg.type())) {
          return
        }

        const logEntry: EnhancedLogEntry = {
          type: msg.type(),
          text: msg.text(),
          location: {
            url: msg.location()?.url,
            line: msg.location()?.lineNumber,
            column: msg.location()?.columnNumber,
          },
          timestamp: new Date().toISOString(),
          // Add metadata for LLM consumption
          severity: msg.type() === 'error' ? 'high' : msg.type() === 'warn' ? 'medium' : 'low',
          category: this.categorizeLogMessage(msg.text()),
        }

        pageResult.logs.push(logEntry)
      })

      // Enhanced JavaScript error capturing with stack traces and error types
      page.on('pageerror', (error) => {
        // Get the error message and stack trace
        const message = error.message || 'Unknown error'
        const stack = error.stack || ''

        // Extract error type, line and column numbers
        const errorType = this.extractErrorType(message)
        const line = this.extractLineNumber(stack)
        const column = this.extractColumnNumber(stack)

        // Create enhanced log entry with detailed error information
        const logEntry: EnhancedLogEntry = {
          type: 'error',
          text: message,
          stack: stack,
          errorType: errorType,
          location: {
            url: page?.url(),
            line: line,
            column: column,
            // We'll try to get source mapping info later if available
          },
          timestamp: new Date().toISOString(),
        }

        pageResult.logs.push(logEntry)

        // Log the error for debugging
        if (this.options.debug) {
          logger.error(`Page error: ${message} (${errorType}) at line:${line} col:${column}`)
        }
      })

      // Monitor failed requests with more detail
      page.on('requestfailed', (request) => {
        try {
          const failedRequest: FailedRequest = {
            url: request.url(),
            method: request.method(),
            resourceType: request.resourceType(),
            errorText: request.failure()?.errorText || 'Unknown error',
            headers: request.headers(),
            timestamp: new Date().toISOString(),
          }

          pageResult.failedRequests.push(failedRequest)

          if (this.options.debug) {
            logger.warn(`Request failed: ${request.url()} - ${failedRequest.errorText}`)
          }
        } catch (error) {
          logger.error(
            `Error processing failed request: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      })

      // Collect new URLs from response
      page.on('response', async (response) => {
        try {
          const status = response.status()
          const url = response.url()
          const contentType = response.headers()['content-type'] || ''

          // If we get a failed response with a status code
          if (status >= 400) {
            try {
              const failedRequest: FailedRequest = {
                url,
                method: response.request().method(),
                resourceType: response.request().resourceType(),
                errorText: `HTTP status ${status}`,
                status,
                headers: response.headers(),
                timestamp: new Date().toISOString(),
              }

              pageResult.failedRequests.push(failedRequest)
            } catch (error) {
              logger.error(
                `Error processing failed response: ${error instanceof Error ? error.message : String(error)}`,
              )
            }
          }

          // Only add internal URLs that are HTML
          if (
            url.startsWith(this.baseUrl) &&
            contentType.includes('text/html') &&
            !this.visitedUrls.has(url) &&
            !this.pendingUrls.includes(url)
          ) {
            this.pendingUrls.push(url)
          }
        } catch (error) {
          logger.error(
            `Error processing response: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      })

      // Log navigation start
      if (this.options.debug) {
        logger.info(`Navigating to ${url} with timeout ${this.options.timeout}ms`)
      }

      // Navigate to the page with timeout and better error handling
      // Navigate to the page with better error handling
      try {
        // First attempt the navigation with domcontentloaded wait condition
        logger.info(`Navigating to ${url} with domcontentloaded wait condition`)
        await page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: this.options.timeout,
        })

        // Give the page some time to execute scripts and render content
        logger.info('Navigation successful, waiting for additional content to load')
        await page.waitForTimeout(2000)

        // Optionally wait for network to become idle
        try {
          await page.waitForLoadState('networkidle', {
            timeout: Math.min(10000, this.options.timeout / 2),
          })
        } catch (loadError) {
          // Continue even if networkidle times out
          logger.info('Network idle wait timed out, continuing anyway')
        }
      } catch (error) {
        if (error instanceof errors.TimeoutError) {
          logger.warn(
            `Navigation to ${url} timed out with 'domcontentloaded', trying without wait conditions`,
          )

          try {
            // Last resort: try with minimal wait conditions
            await page.goto(url, {
              timeout: this.options.timeout,
              waitUntil: undefined,
            })

            // Still give it some time to render
            await page.waitForTimeout(2000)
          } catch (secondError) {
            throw new Error(
              `Failed to load ${url}: ${secondError instanceof Error ? secondError.message : String(secondError)}`,
            )
          }
        } else {
          throw error
        }
      }

      // Get the page title
      pageResult.title = await page.title()

      if (this.options.debug) {
        logger.info(`Page loaded: ${pageResult.title}`)
      }

      try {
        logger.info(`Scrolling page to trigger lazy loading: ${url}`)

        // Get the page height
        const bodyHeight = await page.evaluate(() => document.body.scrollHeight)

        // Scroll down in increments to trigger lazy loading
        for (let scrollPos = 0; scrollPos < bodyHeight; scrollPos += 500) {
          await page.evaluate((scrollY) => window.scrollTo(0, scrollY), scrollPos)
          await page.waitForTimeout(100) // Brief pause to let content load
        }

        // Ensure we reach the bottom
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(1000) // Wait for any lazy content to load

        // Additional waiting for potential network activity
        try {
          await page.waitForLoadState('networkidle', { timeout: 5000 })
        } catch (error) {
          // Ignore - we'll continue even if network doesn't become fully idle
        }

        // Scroll back to top for the screenshot
        await page.evaluate(() => window.scrollTo(0, 0))
        await page.waitForTimeout(500) // Brief pause to stabilize
      } catch (error) {
        logger.warn(
          `Error during page scrolling: ${error instanceof Error ? error.message : String(error)}`,
        )
      }

      // Take a screenshot
      const screenshotPath = path.join(pageDir, 'screenshot.png')
      await page.screenshot({ path: screenshotPath })
      pageResult.screenshot = screenshotPath

      // Capture DevTools CDP data (Chrome only) with JavaScript error capture focus
      if (this.options.browser === 'chromium') {
        try {
          const cdpSession = await page.context().newCDPSession(page)

          // Enable Performance and Coverage domains
          await cdpSession.send('Performance.enable')
          await cdpSession.send('Debugger.enable')
          await cdpSession.send('Runtime.enable')

          // Start JS coverage collection
          await cdpSession.send('Profiler.enable')
          await cdpSession.send('Profiler.startPreciseCoverage', {
            callCount: true,
            detailed: true,
          })

          // Wait a moment for data collection
          await page.waitForTimeout(1500)

          // Get performance metrics
          const performanceMetrics = await cdpSession.send('Performance.getMetrics')
          pageResult.performanceMetrics = performanceMetrics

          // Get JS coverage
          const jsCoverage = await cdpSession.send('Profiler.takePreciseCoverage')
          pageResult.jsCoverage = jsCoverage

          // Get more details about any source maps
          const sourceMapURLs = new Set<string>()

          // Look for source map URLs in script responses
          for (const script of jsCoverage.result) {
            if (script.url) {
              try {
                // Try to find sourceMappingURL comment
                const response = await page.goto(script.url, { waitUntil: 'domcontentloaded' })
                const text = (await response?.text()) || ''

                const sourceMapMatch = text.match(/\/\/# sourceMappingURL=(.+)$/m)
                if (sourceMapMatch && sourceMapMatch[1]) {
                  const sourceMapURL = new URL(sourceMapMatch[1], script.url).href
                  sourceMapURLs.add(sourceMapURL)
                }
              } catch (error) {
                // Ignore errors when fetching script content
              }
            }
          }

          // Store source map URLs
          if (sourceMapURLs.size > 0) {
            fs.writeFileSync(
              path.join(pageDir, 'sourcemap-urls.json'),
              JSON.stringify([...sourceMapURLs], null, 2),
            )
          }

          // Disable profiler
          await cdpSession.send('Profiler.stopPreciseCoverage')
          await cdpSession.send('Profiler.disable')

          // Write performance and coverage data
          fs.writeFileSync(
            path.join(pageDir, 'performance-metrics.json'),
            JSON.stringify(performanceMetrics, null, 2),
          )
          fs.writeFileSync(
            path.join(pageDir, 'js-coverage.json'),
            JSON.stringify(jsCoverage, null, 2),
          )
        } catch (error) {
          logger.warn(
            `Error capturing CDP data: ${error instanceof Error ? error.message : String(error)}`,
          )
        }
      }

      // Write logs
      const logsPath = path.join(pageDir, 'console-logs.json')
      fs.writeFileSync(logsPath, JSON.stringify(pageResult.logs, null, 2))

      // Write failed requests
      const failedRequestsPath = path.join(pageDir, 'failed-requests.json')
      fs.writeFileSync(failedRequestsPath, JSON.stringify(pageResult.failedRequests, null, 2))

      // If requested, capture page content and resources
      if (this.options.includeResources) {
        const htmlPath = path.join(pageDir, 'page.html')
        const content = await page.content()
        fs.writeFileSync(htmlPath, content)

        // Get all CSS and JS resources
        if (this.options.logResourceContent) {
          const resourcesDir = path.join(pageDir, 'resources')
          if (!fs.existsSync(resourcesDir)) {
            fs.mkdirSync(resourcesDir, { recursive: true })
          }

          const resources = await page.evaluate(() => {
            const getResourceUrls = () => {
              const cssLinks = Array.from(document.querySelectorAll('link[rel="stylesheet"]')).map(
                (link) => (link as HTMLLinkElement).href,
              )

              const scriptSrcs = Array.from(document.querySelectorAll('script[src]')).map(
                (script) => (script as HTMLScriptElement).src,
              )

              return [...cssLinks, ...scriptSrcs]
            }

            return getResourceUrls()
          })

          // Save resource URLs
          fs.writeFileSync(
            path.join(resourcesDir, 'resource-urls.json'),
            JSON.stringify(resources, null, 2),
          )
        }
      }

      const llmContext = this.prepareLLMContext(pageResult)
      const llmContextPath = path.join(pageDir, 'llm-context.json')
      fs.writeFileSync(llmContextPath, JSON.stringify(llmContext, null, 2))

      // Also save category-specific files for more focused analysis
      Object.entries(llmContext.details).forEach(([category, issues]) => {
        const categoryPath = path.join(pageDir, `${category.toLowerCase()}-issues.json`)
        fs.writeFileSync(categoryPath, JSON.stringify(issues, null, 2))
      })

      // Close the page to free up memory
      if (page) {
        await page.close()
        page = null
      }

      // Add to results
      this.results.push(pageResult)

      logger.info(`Successfully processed ${url}`)
    } catch (error) {
      pageResult.status = 'error'
      pageResult.error = error instanceof Error ? error.message : String(error)

      // Enhanced error logging in debug mode
      if (this.options.debug && error instanceof Error) {
        logger.error(`Error processing ${url}:`)
        logger.error(`Message: ${error.message}`)
        logger.error(`Stack: ${error.stack}`)
      } else {
        logger.error(`Error processing ${url}: ${pageResult.error}`)
      }

      // Make sure to close the page
      if (page) {
        try {
          await page.close()
        } catch (closeError) {
          logger.warn(
            `Error closing page: ${closeError instanceof Error ? closeError.message : String(closeError)}`,
          )
        }
      }

      // Still add to results even if there was an error
      this.results.push(pageResult)
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename
      .replace(/[^a-z0-9]/gi, '_')
      .toLowerCase()
      .substring(0, 100) // Avoid filename too long errors
  }

  /**
   * Categorizes log messages for better LLM context
   */
  private categorizeLogMessage(message: string): string {
    // Common categories for errors and warnings
    if (message.includes('CORS') || message.includes('cross-origin')) {
      return 'CORS_ISSUE'
    } else if (message.includes('Mixed Content')) {
      return 'MIXED_CONTENT'
    } else if (message.includes('Uncaught TypeError') || message.includes('TypeError:')) {
      return 'TYPE_ERROR'
    } else if (message.includes('undefined') && message.includes('is not')) {
      return 'UNDEFINED_REFERENCE'
    } else if (message.includes('null') && message.includes('is not')) {
      return 'NULL_REFERENCE'
    } else if (message.includes('Uncaught Reference') || message.includes('ReferenceError:')) {
      return 'MISSING_REFERENCE'
    } else if (message.includes('Uncaught Syntax') || message.includes('SyntaxError:')) {
      return 'SYNTAX_ERROR'
    } else if (message.includes('404') || message.includes('failed to load')) {
      return 'RESOURCE_NOT_FOUND'
    } else if (message.includes('deprecated')) {
      return 'DEPRECATED_USAGE'
    } else if (message.includes('memory') || message.includes('leak')) {
      return 'MEMORY_ISSUE'
    } else if (message.includes('performance') || message.includes('slow')) {
      return 'PERFORMANCE_ISSUE'
    }

    return 'OTHER'
  }

  /**
   * Prepares data in a format optimized for LLM consumption
   */
  /**
   * Improved prepareLLMContext function with deduplication
   */
  private prepareLLMContext(pageResult: PageResult): any {
    // Group errors and warnings by category
    const issuesByCategory: Record<string, Array<any>> = {}

    // Deduplication tracking
    const seenMessages = new Map<string, number>()
    const seenNetworkErrors = new Map<string, number>()

    // Process logs with deduplication
    pageResult.logs.forEach((log) => {
      const category = log.category || 'UNCATEGORIZED'

      if (!issuesByCategory[category]) {
        issuesByCategory[category] = []
      }

      // Create a unique signature for this log entry
      const messageSignature = `${log.type}-${log.text}-${log.location?.url || ''}`

      if (seenMessages.has(messageSignature)) {
        // Increment counter for duplicates
        seenMessages.set(messageSignature, seenMessages.get(messageSignature)! + 1)
      } else {
        // Add this as a new issue
        seenMessages.set(messageSignature, 1)

        issuesByCategory[category].push({
          message: log.text,
          type: log.type,
          location: log.location,
          errorType: log.errorType || undefined,
        })
      }
    })

    // Process failed requests with deduplication
    pageResult.failedRequests.forEach((request) => {
      const category = 'NETWORK_ERROR'

      if (!issuesByCategory[category]) {
        issuesByCategory[category] = []
      }

      // Create a unique signature for this network error
      const errorSignature = `${request.url}-${request.errorText}-${request.status || ''}`

      if (seenNetworkErrors.has(errorSignature)) {
        // Increment counter for duplicates
        seenNetworkErrors.set(errorSignature, seenNetworkErrors.get(errorSignature)! + 1)
      } else {
        // Add this as a new issue
        seenNetworkErrors.set(errorSignature, 1)

        issuesByCategory[category].push({
          url: request.url,
          method: request.method,
          errorText: request.errorText,
          status: request.status,
        })
      }
    })

    // Add duplicate counts to provide context
    const duplicationMetrics = {
      logEntries: {
        total: pageResult.logs.length,
        unique: seenMessages.size,
        duplicates: pageResult.logs.length - seenMessages.size,
      },
      networkErrors: {
        total: pageResult.failedRequests.length,
        unique: seenNetworkErrors.size,
        duplicates: pageResult.failedRequests.length - seenNetworkErrors.size,
      },
      duplicateDetails: [...seenMessages.entries()]
        .filter(([_, count]) => count > 1)
        .map(([key, count]) => ({
          signature: key,
          count: count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5), // Top 5 duplicates
    }

    // Sort issues by frequency
    const sortedCategories = Object.entries(issuesByCategory).sort(
      (a, b) => b[1].length - a[1].length,
    )

    // Create final LLM-friendly context
    return {
      url: pageResult.url,
      title: pageResult.title,
      timestamp: pageResult.timestamp,
      summary: {
        totalIssues: pageResult.logs.length + pageResult.failedRequests.length,
        uniqueIssues: seenMessages.size + seenNetworkErrors.size,
        duplicationMetrics,
        categories: sortedCategories.map(([category, issues]) => ({
          name: category,
          count: issues.length,
          examples: issues.slice(0, 3), // Just include a few examples per category
        })),
      },
      details: sortedCategories.reduce(
        (acc, [category, issues]) => {
          acc[category] = issues
          return acc
        },
        {} as Record<string, any>,
      ),
    }
  }
}

// CLI entry point
async function main() {
  try {
    const args = process.argv.slice(2)
    const startUrl = args[0] || 'http://localhost:3000'
    const outputDir = args[1] || './results'
    const debug = args.includes('--debug') || process.env.DEBUG === 'true'

    logger.info(`Starting crawler with URL: ${startUrl}`)

    const crawler = new WebsiteCrawler({
      startUrl,
      outputDir,
      maxPages: 20,
      screenshotHeight: 1200,
      includeResources: true,
      logResourceContent: false,
      headless: false, // Setting to false to see what's happening
      timeout: debug ? 60000 : 30000,
      browser: 'chromium',
      debug,
    })

    await crawler.crawl()
  } catch (error) {
    logger.error(`Error in main: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { WebsiteCrawler }
export type { CrawlOptions, PageResult, EnhancedLogEntry, FailedRequest }
