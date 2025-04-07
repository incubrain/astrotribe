// src/index.ts
import fs from 'fs'
import path from 'path'
import { URL } from 'url'
import { time } from 'console'
import type { Browser, Page, BrowserContext } from 'playwright'
import { chromium, firefox, webkit, errors } from 'playwright'
import { parseStringPromise } from 'xml2js'
import { createLogger, format, transports } from 'winston'

// Import new modules
import { ErrorPatternMatcher } from './errorPatternMatcher'
import { HealthScoreCalculator } from './healthScoreCalculator'
import { SummaryDashboardGenerator } from './summaryDashboard'
import { PageReportGenerator } from './pageReportGenerator'
import { BuildLogIntegration } from './buildLogIntegration'
import type {
  EnhancedLogEntry,
  FailedRequest,
  PageResult,
  CrawlOptions,
  CrawlSummary,
} from './types'

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
  private errorPatternMatcher: ErrorPatternMatcher
  private healthScoreCalculator: HealthScoreCalculator
  private buildLogIntegration?: BuildLogIntegration

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

    // Initialize new components
    this.errorPatternMatcher = new ErrorPatternMatcher()
    this.healthScoreCalculator = new HealthScoreCalculator()

    // Initialize build log integration if build command is provided
    if (options.buildCommand) {
      this.buildLogIntegration = new BuildLogIntegration(
        this.options.outputDir,
        options.buildCommand,
      )
    }
  }

  public async crawl(): Promise<void> {
    try {
      logger.info(`Starting crawl of ${this.options.startUrl}`)

      // Capture build log if build command is provided
      if (this.buildLogIntegration) {
        await this.buildLogIntegration.captureBuildLog()
      }

      // Launch browser
      await this.launchBrowser()

      // Extract base URL
      const startUrlObj = new URL(this.options.startUrl)
      this.baseUrl = `${startUrlObj.protocol}//${startUrlObj.host}`

      // Add start URL to pending URLs
      this.pendingUrls.push(this.options.startUrl)

      // Process URLs until max pages is reached or no more URLs to process
      while (this.pendingUrls.length > 0 && this.visitedUrls.size < this.options.maxPages) {
        const url = this.pendingUrls.shift()!

        // Skip if already visited
        if (this.visitedUrls.has(url)) {
          continue
        }

        // Mark as visited
        this.visitedUrls.add(url)

        // Process URL
        await this.processUrl(url)
      }

      // Generate summary
      await this.generateSummary()

      // Close browser
      await this.closeBrowser()

      logger.info(`Crawl completed. Visited ${this.visitedUrls.size} pages.`)
    } catch (error) {
      logger.error(`Crawl failed: ${error}`)
      await this.closeBrowser()
      throw error
    }
  }

  private async launchBrowser(): Promise<void> {
    logger.info(`Launching ${this.options.browser} browser`)

    const launchOptions = {
      headless: this.options.headless,
    }

    switch (this.options.browser) {
      case 'chromium':
        this.browser = await chromium.launch(launchOptions)
        break
      case 'firefox':
        this.browser = await firefox.launch(launchOptions)
        break
      case 'webkit':
        this.browser = await webkit.launch(launchOptions)
        break
      default:
        throw new Error(`Unsupported browser: ${this.options.browser}`)
    }

    this.context = await this.browser.newContext()

    // Set up console message handler
    this.context.on('console', (msg) => {
      const type = msg.type()
      const text = msg.text()

      // Skip if not capturing all logs and not an error/warning
      if (!this.options.captureAllLogs && type !== 'error' && type !== 'warning') {
        return
      }

      // Get location information if available
      const location = msg.location()
      const stack = location
        ? `${location.url}:${location.lineNumber}:${location.columnNumber}`
        : ''

      // Create log entry
      const logEntry: EnhancedLogEntry = {
        type,
        text,
        stack,
        timestamp: new Date().toISOString(),
        severity: type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'info',
      }

      // Process log entry with error pattern matcher
      this.errorPatternMatcher.processLogEntry(logEntry)

      // Store log entry in current page result
      if (this.currentPageResult) {
        this.currentPageResult.logs.push(logEntry)
      }
    })

    // Set up request failure handler
    this.context.on('requestfailed', (request) => {
      const failure = request.failure()

      if (failure) {
        const failedRequest: FailedRequest = {
          url: request.url(),
          method: request.method(),
          resourceType: request.resourceType(),
          errorText: failure.errorText,
          status: failure.status,
          timestamp: new Date().toISOString(),
          headers: request.headers(),
        }

        // Store failed request in current page result
        if (this.currentPageResult) {
          this.currentPageResult.failedRequests.push(failedRequest)
        }
      }
    })
  }

  private async closeBrowser(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
      this.browser = undefined
      this.context = undefined
    }
  }

  private async getSitemapUrls(): Promise<string[]> {
    try {
      const sitemapUrl = `${this.baseUrl}/sitemap.xml`
      const response = await fetch(sitemapUrl)

      if (!response.ok) {
        logger.warn(`Failed to fetch sitemap: ${response.status} ${response.statusText}`)
        return []
      }

      const xml = await response.text()
      const result = await parseStringPromise(xml)

      if (!result.urlset || !result.urlset.url) {
        return []
      }

      return result.urlset.url.map((url: any) => url.loc[0])
    } catch (error) {
      logger.warn(`Error fetching sitemap: ${error}`)
      return []
    }
  }

  private extractErrorType(message: string): string {
    const errorTypeMatch = message.match(/^([A-Za-z]+Error):/)
    return errorTypeMatch ? errorTypeMatch[1] : 'UnknownError'
  }

  private extractLineNumber(stack: string): number | undefined {
    const lineMatch = stack.match(/at .+ \((\w+):(\d+):(\d+)\)/)
    return lineMatch ? parseInt(lineMatch[2], 10) : undefined
  }

  private extractColumnNumber(stack: string): number | undefined {
    const columnMatch = stack.match(/at .+ \((\w+):(\d+):(\d+)\)/)
    return columnMatch ? parseInt(columnMatch[3], 10) : undefined
  }

  private createPageDirectory(url: string): string {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)

    // Create directory path
    let dirPath = this.options.outputDir

    if (pathParts.length > 0) {
      // Create subdirectories for path parts
      for (let i = 0; i < pathParts.length - 1; i++) {
        const part = this.sanitizeFilename(pathParts[i])
        dirPath = path.join(dirPath, part)

        // Create directory if it doesn't exist
        if (!fs.existsSync(dirPath)) {
          fs.mkdirSync(dirPath, { recursive: true })
        }
      }
    }

    return dirPath
  }

  private currentPageResult?: PageResult

  private async processUrl(url: string): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized')
    }

    logger.info(`Processing URL: ${url}`)

    try {
      // Create page
      const page = await this.context.newPage()

      // Set timeout
      page.setDefaultTimeout(this.options.timeout)

      // Create page directory
      const pageDir = this.createPageDirectory(url)

      // Create page result
      this.currentPageResult = {
        url,
        title: '',
        status: 'success',
        logs: [],
        failedRequests: [],
        screenshot: '',
        timestamp: new Date().toISOString(),
      }

      // Navigate to URL
      await page.goto(url, { waitUntil: 'networkidle' })

      // Get page title
      this.currentPageResult.title = await page.title()

      // Take screenshot
      const screenshotPath = path.join(
        pageDir,
        `${this.sanitizeFilename(path.basename(url) || 'index')}.png`,
      )
      await page.screenshot({
        path: screenshotPath,
        fullPage: false,
        clip: {
          x: 0,
          y: 0,
          width: page.viewportSize()?.width || 1200,
          height: this.options.screenshotHeight,
        },
      })
      this.currentPageResult.screenshot = screenshotPath

      // Collect performance metrics
      const performanceMetrics = await page.evaluate(() => {
        const metrics: any = {}

        // Get performance entries
        const entries = performance.getEntries()

        // Extract metrics
        entries.forEach((entry: any) => {
          if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
            metrics.firstContentfulPaint = entry.startTime
          }

          if (entry.entryType === 'largest-contentful-paint') {
            metrics.largestContentfulPaint = entry.startTime
          }

          if (entry.entryType === 'first-input' && entry.processingStart) {
            metrics.firstInputDelay = entry.processingStart - entry.startTime
          }

          if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
            metrics.cumulativeLayoutShift = (metrics.cumulativeLayoutShift || 0) + entry.value
          }

          if (entry.entryType === 'longtask') {
            metrics.totalBlockingTime = (metrics.totalBlockingTime || 0) + entry.duration
          }

          if (entry.entryType === 'navigation') {
            metrics.timeToFirstByte = entry.responseStart - entry.requestStart
            metrics.domContentLoaded = entry.domContentLoadedEventEnd - entry.navigationStart
            metrics.load = entry.loadEventEnd - entry.navigationStart
          }
        })

        // Calculate Speed Index (simplified)
        const firstPaint = entries.find(
          (e: any) => e.entryType === 'paint' && e.name === 'first-paint',
        )
        if (firstPaint) {
          metrics.speedIndex = firstPaint.startTime / 1000 // Convert to seconds
        }

        return metrics
      })

      this.currentPageResult.performanceMetrics = performanceMetrics

      // Extract links for crawling
      const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a[href]'))
          .map((a) => a.getAttribute('href'))
          .filter((href): href is string => !!href)
      })

      // Add links to pending URLs
      for (const link of links) {
        try {
          // Resolve relative URLs
          const absoluteUrl = new URL(link, url).toString()

          // Skip if not same origin
          if (!absoluteUrl.startsWith(this.baseUrl)) {
            continue
          }

          // Skip if already visited or pending
          if (this.visitedUrls.has(absoluteUrl) || this.pendingUrls.includes(absoluteUrl)) {
            continue
          }

          // Add to pending URLs
          this.pendingUrls.push(absoluteUrl)
        } catch (error) {
          logger.warn(`Invalid URL: ${link}`)
        }
      }

      // Close page
      await page.close()

      // Calculate health score
      this.healthScoreCalculator.calculateHealthScore(this.currentPageResult)

      // Generate page report
      const pageReportGenerator = new PageReportGenerator(this.currentPageResult, pageDir)
      await pageReportGenerator.generateReport()

      // Add to results
      this.results.push(this.currentPageResult)

      logger.info(`Successfully processed URL: ${url}`)
    } catch (error) {
      logger.error(`Error processing URL ${url}: ${error}`)

      // Update page result with error
      if (this.currentPageResult) {
        this.currentPageResult.status = 'error'
        this.currentPageResult.error = error instanceof Error ? error.message : String(error)
        this.results.push(this.currentPageResult)
      }
    }
  }

  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  private categorizeLogMessage(message: string): string {
    if (message.includes('Failed to load resource')) {
      return 'Resource'
    }

    if (message.includes('TypeError') || message.includes('ReferenceError')) {
      return 'JavaScript'
    }

    if (message.includes('SyntaxError')) {
      return 'Syntax'
    }

    if (message.includes('DOMException')) {
      return 'DOM'
    }

    if (message.includes('NetworkError') || message.includes('net::')) {
      return 'Network'
    }

    return 'Other'
  }

  private prepareLLMContext(pageResult: PageResult): any {
    // Use error pattern matcher to get deduplicated logs
    const deduplicatedLogs = this.errorPatternMatcher.getDeduplicatedLogs(pageResult.logs)

    return {
      url: pageResult.url,
      title: pageResult.title,
      status: pageResult.status,
      error: pageResult.error,
      healthScore: pageResult.healthScore,
      healthStatus: pageResult.healthScore
        ? HealthScoreCalculator.getHealthStatus(pageResult.healthScore)
        : 'Unknown',
      logs: deduplicatedLogs,
      failedRequests: pageResult.failedRequests,
      performanceMetrics: pageResult.performanceMetrics,
    }
  }

  private async generateSummary(): Promise<void> {
    // Create summary
    const summary: CrawlSummary = {
      startUrl: this.options.startUrl,
      totalPagesVisited: this.visitedUrls.size,
      timestamp: new Date().toISOString(),
      results: this.results,
    }

    // Ensure output directory exists
    if (!fs.existsSync(this.options.outputDir)) {
      fs.mkdirSync(this.options.outputDir, { recursive: true })
    }

    // Write summary to file
    const summaryPath = path.join(this.options.outputDir, 'summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

    // Generate dashboard
    const dashboardGenerator = new SummaryDashboardGenerator(summary, this.options.outputDir)
    await dashboardGenerator.generateDashboard()

    logger.info(`Summary written to ${summaryPath}`)
  }
}

async function main() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.log('Usage: pnpm start <url> [options]')
    console.log('Options:')
    console.log('  --max-pages <number>  Maximum pages to crawl (default: 50)')
    console.log('  --output <directory>  Output directory (default: ./results)')
    console.log('  --height <pixels>     Screenshot height (default: 1200)')
    console.log('  --resources           Include HTML and resources')
    console.log('  --content             Log resource content')
    console.log('  --visible             Run in visible mode (not headless)')
    console.log('  --timeout <ms>        Page load timeout in milliseconds (default: 30000)')
    console.log(
      '  --browser <type>      Browser to use (chromium, firefox, webkit) (default: chromium)',
    )
    console.log('  --debug               Enable debug mode')
    console.log('  --capture-all-logs    Capture all console logs, not just errors and warnings')
    console.log('  --build-command <cmd> Command to run for build log capture')
    process.exit(1)
  }

  const url = args[0]
  const options: CrawlOptions = {
    startUrl: url,
    outputDir: './results',
  }

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i]

    if (arg === '--max-pages' && i + 1 < args.length) {
      options.maxPages = parseInt(args[++i], 10)
    } else if (arg === '--output' && i + 1 < args.length) {
      options.outputDir = args[++i]
    } else if (arg === '--height' && i + 1 < args.length) {
      options.screenshotHeight = parseInt(args[++i], 10)
    } else if (arg === '--resources') {
      options.includeResources = true
    } else if (arg === '--content') {
      options.logResourceContent = true
    } else if (arg === '--visible') {
      options.headless = false
    } else if (arg === '--timeout' && i + 1 < args.length) {
      options.timeout = parseInt(args[++i], 10)
    } else if (arg === '--browser' && i + 1 < args.length) {
      options.browser = args[++i] as 'chromium' | 'firefox' | 'webkit'
    } else if (arg === '--debug') {
      options.debug = true
    } else if (arg === '--capture-all-logs') {
      options.captureAllLogs = true
    } else if (arg === '--build-command' && i + 1 < args.length) {
      options.buildCommand = args[++i]
    }
  }

  // Create crawler
  const crawler = new WebsiteCrawler(options)

  // Run crawler
  await crawler.crawl()
}

// Run main function if this file is executed directly
if (require.main === module) {
  main().catch((error) => {
    console.error(`Error: ${error}`)
    process.exit(1)
  })
}

export { WebsiteCrawler }
