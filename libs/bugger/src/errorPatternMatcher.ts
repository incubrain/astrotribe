import type { EnhancedLogEntry } from './types'

/**
 * Error pattern matcher for deduplicating and categorizing console logs
 */
export class ErrorPatternMatcher {
  private errorPatterns: Map<string, { pattern: RegExp; category: string }> = new Map()
  private errorCounts: Map<string, number> = new Map()
  private errorExamples: Map<string, EnhancedLogEntry> = new Map()

  constructor() {
    // Initialize common error patterns
    this.initializeErrorPatterns()
  }

  /**
   * Initialize common error patterns with their categories
   */
  private initializeErrorPatterns(): void {
    // Network errors
    this.addPattern(
      /Failed to load resource: the server responded with a status of (\d+)/,
      'Network',
    )
    this.addPattern(/net::ERR_/, 'Network')
    this.addPattern(/Failed to fetch/, 'Network')

    // DOM errors
    this.addPattern(/TypeError: Cannot read property '(.+)' of (undefined|null)/, 'DOM')
    this.addPattern(/TypeError: (.*) is not a function/, 'DOM')
    this.addPattern(/ReferenceError: (.*) is not defined/, 'DOM')

    // Script errors
    this.addPattern(/SyntaxError: (.*)/, 'Script')
    this.addPattern(/Uncaught (.*)/, 'Script')

    // Resource errors
    this.addPattern(/Failed to load resource: (.*)/, 'Resource')
    this.addPattern(/Resource interpreted as (.*) but transferred with MIME type (.*)/, 'Resource')

    // Performance errors
    this.addPattern(/Performance warning: (.*)/, 'Performance')

    // Generic errors
    this.addPattern(/Error: (.*)/, 'Generic')
  }

  /**
   * Add a new error pattern
   */
  private addPattern(pattern: RegExp, category: string): void {
    const patternKey = pattern.toString()
    this.errorPatterns.set(patternKey, { pattern, category })
  }

  /**
   * Match an error message against known patterns
   */
  public matchError(logEntry: EnhancedLogEntry): { pattern: string; category: string } | null {
    const message = logEntry.text

    for (const [patternKey, { pattern, category }] of this.errorPatterns.entries()) {
      if (pattern.test(message)) {
        return { pattern: patternKey, category }
      }
    }

    // Check stack trace for additional context if available
    if (logEntry.stack) {
      for (const [patternKey, { pattern, category }] of this.errorPatterns.entries()) {
        if (pattern.test(logEntry.stack)) {
          return { pattern: patternKey, category }
        }
      }
    }

    return null
  }

  /**
   * Process a log entry and update error counts and examples
   */
  public processLogEntry(logEntry: EnhancedLogEntry): void {
    const match = this.matchError(logEntry)

    if (match) {
      const { pattern, category } = match

      // Update error count
      const currentCount = this.errorCounts.get(pattern) || 0
      this.errorCounts.set(pattern, currentCount + 1)

      // Store example if we don't have one yet
      if (!this.errorExamples.has(pattern)) {
        this.errorExamples.set(pattern, logEntry)
      }

      // Add category to log entry
      logEntry.category = category
    }
  }

  /**
   * Get error statistics
   */
  public getErrorStats(): Array<{
    pattern: string
    category: string
    count: number
    example: EnhancedLogEntry
  }> {
    const stats: Array<{
      pattern: string
      category: string
      count: number
      example: EnhancedLogEntry
    }> = []

    for (const [pattern, count] of this.errorCounts.entries()) {
      const { category } = this.errorPatterns.get(pattern) || { category: 'Unknown' }
      const example = this.errorExamples.get(pattern)

      if (example) {
        stats.push({
          pattern,
          category,
          count,
          example,
        })
      }
    }

    // Sort by count (descending)
    return stats.sort((a, b) => b.count - a.count)
  }

  /**
   * Get deduplicated logs with counts
   */
  public getDeduplicatedLogs(logs: EnhancedLogEntry[]): Array<{
    category: string
    count: number
    example: EnhancedLogEntry
    pattern: string
  }> {
    // Reset state
    this.errorCounts.clear()
    this.errorExamples.clear()

    // Process all logs
    logs.forEach((log) => this.processLogEntry(log))

    // Return deduplicated logs
    return this.getErrorStats()
  }
}
