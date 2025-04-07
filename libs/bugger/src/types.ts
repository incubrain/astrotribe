/**
 * Enhanced log entry with additional metadata
 */
export interface EnhancedLogEntry {
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

/**
 * Failed request information
 */
export interface FailedRequest {
  url: string
  method: string
  resourceType: string
  errorText: string
  status?: number
  timestamp: string
  headers?: Record<string, string>
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  firstContentfulPaint?: number
  largestContentfulPaint?: number
  firstInputDelay?: number
  cumulativeLayoutShift?: number
  totalBlockingTime?: number
  speedIndex?: number
  timeToFirstByte?: number
  domContentLoaded?: number
  load?: number
}

/**
 * Page result with all collected data
 */
export interface PageResult {
  url: string
  title: string
  status: 'success' | 'error'
  error?: string
  logs: EnhancedLogEntry[]
  failedRequests: FailedRequest[]
  screenshot: string
  timestamp: string
  performanceMetrics?: PerformanceMetrics
  jsCoverage?: any
  cssCoverage?: any
  healthScore?: number
  healthScoreBreakdown?: {
    errors: number
    warnings: number
    performance: number
    resources: number
  }
}

/**
 * Crawl options
 */
export interface CrawlOptions {
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

/**
 * Crawl summary
 */
export interface CrawlSummary {
  startUrl: string
  totalPagesVisited: number
  timestamp: string
  results: PageResult[]
  siteHealthScore?: number
  commonIssues?: Array<{
    category: string
    count: number
    example: EnhancedLogEntry
    pattern: string
  }>
}

/**
 * Analysis options
 */
export interface AnalysisOptions {
  summaryPath: string
  outputPath?: string
  errorThreshold?: number
  warningThreshold?: number
}

/**
 * Analysis result
 */
export interface AnalysisResult {
  totalPages: number
  errorPages: number
  warnPages: number
  totalErrors: number
  totalWarnings: number
  totalFailedRequests: number
  commonErrors: Array<{ error: string; count: number }>
  commonErrorPatterns: Array<{ pattern: string; count: number }>
  pagesRanked: Array<{
    url: string
    errorCount: number
    warningCount: number
    failedRequestCount: number
  }>
  siteHealthScore?: number
}
