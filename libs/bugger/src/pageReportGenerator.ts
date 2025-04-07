import fs from 'fs'
import path from 'path'
import type { PageResult } from './types'
import { HealthScoreCalculator } from './healthScoreCalculator'
import { ErrorPatternMatcher } from './errorPatternMatcher'

/**
 * Generates a consolidated page report with YAML frontmatter and markdown content
 */
export class PageReportGenerator {
  private pageResult: PageResult
  private outputPath: string
  private healthScoreCalculator: HealthScoreCalculator
  private errorPatternMatcher: ErrorPatternMatcher

  constructor(pageResult: PageResult, outputPath: string) {
    this.pageResult = pageResult
    this.outputPath = outputPath
    this.healthScoreCalculator = new HealthScoreCalculator()
    this.errorPatternMatcher = new ErrorPatternMatcher()
  }

  /**
   * Generate the page report
   */
  public async generateReport(): Promise<void> {
    // Calculate health score if not already calculated
    if (!this.pageResult.healthScore) {
      this.healthScoreCalculator.calculateHealthScore(this.pageResult)
    }

    // Create the report content
    const reportContent = this.createReportContent()

    // Determine the filename
    const fileName = this.getFileName()
    const filePath = path.join(this.outputPath, fileName)

    // Write the report to a file
    fs.writeFileSync(filePath, reportContent)

    console.log(`Page report generated at: ${filePath}`)
  }

  /**
   * Create the report content with YAML frontmatter and markdown
   */
  private createReportContent(): string {
    const healthStatus = HealthScoreCalculator.getHealthStatus(this.pageResult.healthScore || 0)
    const timestamp = new Date(this.pageResult.timestamp).toLocaleString()

    // Create YAML frontmatter
    const frontmatter = this.createFrontmatter()

    // Create markdown content
    const markdown = this.createMarkdownContent()

    // Combine frontmatter and markdown
    return `${frontmatter}\n\n${markdown}`
  }

  /**
   * Create YAML frontmatter
   */
  private createFrontmatter(): string {
    const healthStatus = HealthScoreCalculator.getHealthStatus(this.pageResult.healthScore || 0)
    const timestamp = new Date(this.pageResult.timestamp).toLocaleString()

    return `---
url: ${this.pageResult.url}
title: ${this.pageResult.title}
timestamp: ${timestamp}
status: ${this.pageResult.status}
health_score: ${this.pageResult.healthScore || 'N/A'}
health_status: ${healthStatus}
screenshot: ${path.basename(this.pageResult.screenshot)}
error_count: ${this.pageResult.logs.filter((log) => log.type === 'error' || log.severity === 'error').length}
warning_count: ${this.pageResult.logs.filter((log) => log.type === 'warning' || log.severity === 'warning').length}
failed_request_count: ${this.pageResult.failedRequests.length}
---
`
  }

  /**
   * Create markdown content
   */
  private createMarkdownContent(): string {
    const healthStatus = HealthScoreCalculator.getHealthStatus(this.pageResult.healthScore || 0)
    const timestamp = new Date(this.pageResult.timestamp).toLocaleString()

    return `# ${this.pageResult.title}

## Page Information

- **URL**: ${this.pageResult.url}
- **Title**: ${this.pageResult.title}
- **Timestamp**: ${timestamp}
- **Status**: ${this.pageResult.status}
- **Health Score**: ${this.pageResult.healthScore || 'N/A'} (${healthStatus})

${this.pageResult.healthScoreBreakdown ? this.renderHealthScoreBreakdown() : ''}

## Screenshot

![Page Screenshot](${path.basename(this.pageResult.screenshot)})

${this.pageResult.error ? `## Error\n\n${this.pageResult.error}\n\n` : ''}

## Console Logs

${this.renderConsoleLogs()}

## Failed Requests

${this.renderFailedRequests()}

${this.pageResult.performanceMetrics ? this.renderPerformanceMetrics() : ''}
`
  }

  /**
   * Render health score breakdown
   */
  private renderHealthScoreBreakdown(): string {
    if (!this.pageResult.healthScoreBreakdown) {
      return ''
    }

    const { errors, warnings, performance, resources } = this.pageResult.healthScoreBreakdown

    return `### Health Score Breakdown

- **Errors**: ${Math.round(errors * 100)}%
- **Warnings**: ${Math.round(warnings * 100)}%
- **Performance**: ${Math.round(performance * 100)}%
- **Resources**: ${Math.round(resources * 100)}%
`
  }

  /**
   * Render console logs
   */
  private renderConsoleLogs(): string {
    if (this.pageResult.logs.length === 0) {
      return 'No console logs found.'
    }

    // Get deduplicated logs with counts
    const deduplicatedLogs = this.errorPatternMatcher.getDeduplicatedLogs(this.pageResult.logs)

    // Group logs by category
    const logsByCategory = new Map<string, typeof deduplicatedLogs>()

    deduplicatedLogs.forEach((log) => {
      const category = log.category || 'Other'
      if (!logsByCategory.has(category)) {
        logsByCategory.set(category, [])
      }
      logsByCategory.get(category)?.push(log)
    })

    // Render logs by category
    let markdown = ''

    for (const [category, logs] of logsByCategory.entries()) {
      markdown += `### ${category} Issues\n\n`

      logs.forEach((log) => {
        markdown += `#### ${log.count} occurrences\n\n`
        markdown += `**Message**: ${log.example.text}\n\n`

        if (log.example.stack) {
          markdown += `**Stack Trace**:\n\`\`\`\n${log.example.stack}\n\`\`\`\n\n`
        }

        if (log.example.location) {
          markdown += `**Location**: ${log.example.location.url || 'Unknown'}\n`
          if (log.example.location.line) {
            markdown += `Line: ${log.example.location.line}`
          }
          if (log.example.location.column) {
            markdown += `, Column: ${log.example.location.column}`
          }
          markdown += '\n\n'
        }
      })
    }

    return markdown
  }

  /**
   * Render failed requests
   */
  private renderFailedRequests(): string {
    if (this.pageResult.failedRequests.length === 0) {
      return 'No failed requests found.'
    }

    let markdown = '| URL | Method | Resource Type | Status | Error |\n'
    markdown += '|-----|--------|---------------|--------|-------|\n'

    this.pageResult.failedRequests.forEach((request) => {
      const status = request.status ? request.status.toString() : 'N/A'
      markdown += `| ${this.truncateUrl(request.url)} | ${request.method} | ${request.resourceType} | ${status} | ${request.errorText} |\n`
    })

    return markdown
  }

  /**
   * Render performance metrics
   */
  private renderPerformanceMetrics(): string {
    if (!this.pageResult.performanceMetrics) {
      return ''
    }

    const metrics = this.pageResult.performanceMetrics

    let markdown = '## Performance Metrics\n\n'
    markdown += '| Metric | Value | Status |\n'
    markdown += '|--------|-------|--------|\n'

    // First Contentful Paint (FCP)
    if (metrics.firstContentfulPaint) {
      const status = this.getPerformanceStatus('fcp', metrics.firstContentfulPaint)
      markdown += `| First Contentful Paint | ${metrics.firstContentfulPaint}ms | ${status} |\n`
    }

    // Largest Contentful Paint (LCP)
    if (metrics.largestContentfulPaint) {
      const status = this.getPerformanceStatus('lcp', metrics.largestContentfulPaint)
      markdown += `| Largest Contentful Paint | ${metrics.largestContentfulPaint}ms | ${status} |\n`
    }

    // First Input Delay (FID)
    if (metrics.firstInputDelay) {
      const status = this.getPerformanceStatus('fid', metrics.firstInputDelay)
      markdown += `| First Input Delay | ${metrics.firstInputDelay}ms | ${status} |\n`
    }

    // Cumulative Layout Shift (CLS)
    if (metrics.cumulativeLayoutShift) {
      const status = this.getPerformanceStatus('cls', metrics.cumulativeLayoutShift)
      markdown += `| Cumulative Layout Shift | ${metrics.cumulativeLayoutShift} | ${status} |\n`
    }

    // Total Blocking Time (TBT)
    if (metrics.totalBlockingTime) {
      const status = this.getPerformanceStatus('tbt', metrics.totalBlockingTime)
      markdown += `| Total Blocking Time | ${metrics.totalBlockingTime}ms | ${status} |\n`
    }

    // Speed Index (SI)
    if (metrics.speedIndex) {
      const status = this.getPerformanceStatus('si', metrics.speedIndex)
      markdown += `| Speed Index | ${metrics.speedIndex}s | ${status} |\n`
    }

    // Time to First Byte (TTFB)
    if (metrics.timeToFirstByte) {
      const status = this.getPerformanceStatus('ttfb', metrics.timeToFirstByte)
      markdown += `| Time to First Byte | ${metrics.timeToFirstByte}ms | ${status} |\n`
    }

    return markdown
  }

  /**
   * Get performance status
   */
  private getPerformanceStatus(metric: string, value: number): string {
    switch (metric) {
      case 'fcp':
        if (value < 1800) return '✅ Good'
        if (value < 3000) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'lcp':
        if (value < 2500) return '✅ Good'
        if (value < 4000) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'fid':
        if (value < 100) return '✅ Good'
        if (value < 300) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'cls':
        if (value < 0.1) return '✅ Good'
        if (value < 0.25) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'tbt':
        if (value < 200) return '✅ Good'
        if (value < 600) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'si':
        if (value < 3.4) return '✅ Good'
        if (value < 5.8) return '⚠️ Needs Improvement'
        return '❌ Poor'
      case 'ttfb':
        if (value < 600) return '✅ Good'
        if (value < 1000) return '⚠️ Needs Improvement'
        return '❌ Poor'
      default:
        return '❓ Unknown'
    }
  }

  /**
   * Get the filename for the report
   */
  private getFileName(): string {
    const urlObj = new URL(this.pageResult.url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    const fileName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'index'
    return `${this.sanitizeFilename(fileName)}.md`
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  /**
   * Truncate URL for display
   */
  private truncateUrl(url: string): string {
    if (url.length <= 50) {
      return url
    }
    return url.substring(0, 47) + '...'
  }
}
