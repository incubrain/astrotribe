import fs from 'fs'
import path from 'path'
import type { CrawlSummary, PageResult } from './types'
import { HealthScoreCalculator } from './healthScoreCalculator'
import { ErrorPatternMatcher } from './errorPatternMatcher'

/**
 * Generates a unified summary dashboard for all crawled pages
 */
export class SummaryDashboardGenerator {
  private summary: CrawlSummary
  private outputPath: string
  private healthScoreCalculator: HealthScoreCalculator
  private errorPatternMatcher: ErrorPatternMatcher

  constructor(summary: CrawlSummary, outputPath: string) {
    this.summary = summary
    this.outputPath = outputPath
    this.healthScoreCalculator = new HealthScoreCalculator()
    this.errorPatternMatcher = new ErrorPatternMatcher()
  }

  /**
   * Generate the summary dashboard
   */
  public async generateDashboard(): Promise<void> {
    // Calculate site-wide health score
    this.calculateSiteHealthScore()

    // Generate common issues across all pages
    this.generateCommonIssues()

    // Create the dashboard HTML
    const dashboardHtml = this.createDashboardHtml()

    // Write the dashboard to a file
    const dashboardPath = path.join(this.outputPath, 'dashboard.html')
    fs.writeFileSync(dashboardPath, dashboardHtml)

    console.log(`Dashboard generated at: ${dashboardPath}`)
  }

  /**
   * Calculate site-wide health score
   */
  private calculateSiteHealthScore(): void {
    // Calculate health scores for all pages
    const pageScores = this.summary.results.map((page) => {
      return this.healthScoreCalculator.calculateHealthScore(page)
    })

    // Calculate average site health score
    const totalScore = pageScores.reduce((sum, score) => sum + score, 0)
    this.summary.siteHealthScore = Math.round(totalScore / pageScores.length)
  }

  /**
   * Generate common issues across all pages
   */
  private generateCommonIssues(): void {
    // Collect all logs from all pages
    const allLogs = this.summary.results.flatMap((page) => page.logs)

    // Get deduplicated logs with counts
    const deduplicatedLogs = this.errorPatternMatcher.getDeduplicatedLogs(allLogs)

    // Store in summary
    this.summary.commonIssues = deduplicatedLogs
  }

  /**
   * Create the dashboard HTML
   */
  private createDashboardHtml(): string {
    const timestamp = new Date().toLocaleString()
    const siteHealthStatus = HealthScoreCalculator.getHealthStatus(
      this.summary.siteHealthScore || 0,
    )
    const healthStatusClass = this.getHealthStatusClass(siteHealthStatus)

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Debug Summary - ${this.summary.startUrl}</title>
  <style>
    :root {
      --good-color: #4caf50;
      --warning-color: #ff9800;
      --poor-color: #f44336;
      --bg-color: #f5f5f5;
      --card-bg: #ffffff;
      --text-color: #333333;
      --border-color: #e0e0e0;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      line-height: 1.6;
      color: var(--text-color);
      background-color: var(--bg-color);
      margin: 0;
      padding: 20px;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
    }
    
    header {
      background-color: var(--card-bg);
      padding: 20px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    
    h1, h2, h3 {
      margin-top: 0;
    }
    
    .health-score {
      font-size: 48px;
      font-weight: bold;
      margin: 20px 0;
    }
    
    .health-good {
      color: var(--good-color);
    }
    
    .health-warning {
      color: var(--warning-color);
    }
    
    .health-poor {
      color: var(--poor-color);
    }
    
    .card {
      background-color: var(--card-bg);
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 20px;
      margin-bottom: 20px;
    }
    
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }
    
    .issue-item {
      border-left: 4px solid var(--border-color);
      padding: 10px;
      margin-bottom: 10px;
    }
    
    .issue-network {
      border-left-color: #2196f3;
    }
    
    .issue-dom {
      border-left-color: #9c27b0;
    }
    
    .issue-script {
      border-left-color: #ff5722;
    }
    
    .issue-resource {
      border-left-color: #009688;
    }
    
    .issue-performance {
      border-left-color: #673ab7;
    }
    
    .issue-generic {
      border-left-color: #795548;
    }
    
    .page-list {
      list-style: none;
      padding: 0;
    }
    
    .page-item {
      padding: 10px;
      border-bottom: 1px solid var(--border-color);
    }
    
    .page-item:last-child {
      border-bottom: none;
    }
    
    .page-link {
      color: #2196f3;
      text-decoration: none;
    }
    
    .page-link:hover {
      text-decoration: underline;
    }
    
    .badge {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: bold;
      margin-left: 8px;
    }
    
    .badge-error {
      background-color: var(--poor-color);
      color: white;
    }
    
    .badge-warning {
      background-color: var(--warning-color);
      color: white;
    }
    
    .badge-good {
      background-color: var(--good-color);
      color: white;
    }
    
    .summary-stats {
      display: flex;
      flex-wrap: wrap;
      gap: 20px;
      margin-bottom: 20px;
    }
    
    .stat-item {
      flex: 1;
      min-width: 200px;
      background-color: var(--card-bg);
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    
    .stat-value {
      font-size: 24px;
      font-weight: bold;
      margin: 10px 0;
    }
    
    .stat-label {
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>Site Debug Summary</h1>
      <p>URL: ${this.summary.startUrl}</p>
      <p>Timestamp: ${timestamp}</p>
      <p>Pages Crawled: ${this.summary.totalPagesVisited}</p>
      
      <div class="health-score ${healthStatusClass}">
        ${this.summary.siteHealthScore} - ${siteHealthStatus}
      </div>
    </header>
    
    <div class="summary-stats">
      <div class="stat-item">
        <div class="stat-value">${this.summary.totalPagesVisited}</div>
        <div class="stat-label">Pages Crawled</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.summary.results.filter((p) => p.status === 'error').length}</div>
        <div class="stat-label">Pages with Errors</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.summary.commonIssues?.length || 0}</div>
        <div class="stat-label">Common Issues</div>
      </div>
      <div class="stat-item">
        <div class="stat-value">${this.summary.results.reduce((sum, page) => sum + page.failedRequests.length, 0)}</div>
        <div class="stat-label">Failed Requests</div>
      </div>
    </div>
    
    <div class="card">
      <h2>Common Issues</h2>
      <div class="grid">
        ${this.renderCommonIssues()}
      </div>
    </div>
    
    <div class="card">
      <h2>Pages</h2>
      <ul class="page-list">
        ${this.renderPageList()}
      </ul>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Render common issues section
   */
  private renderCommonIssues(): string {
    if (!this.summary.commonIssues || this.summary.commonIssues.length === 0) {
      return '<p>No common issues found.</p>'
    }

    return this.summary.commonIssues
      .map(
        (issue) => `
      <div class="issue-item issue-${issue.category.toLowerCase()}">
        <h3>${issue.category} Issue (${issue.count} occurrences)</h3>
        <p><strong>Pattern:</strong> ${this.escapeHtml(issue.pattern)}</p>
        <p><strong>Example:</strong> ${this.escapeHtml(issue.example.text)}</p>
        ${issue.example.stack ? `<pre>${this.escapeHtml(issue.example.stack)}</pre>` : ''}
      </div>
    `,
      )
      .join('')
  }

  /**
   * Render page list section
   */
  private renderPageList(): string {
    return this.summary.results
      .map((page) => {
        const healthStatus = HealthScoreCalculator.getHealthStatus(page.healthScore || 0)
        const healthStatusClass = this.getHealthStatusClass(healthStatus)
        const errorCount = page.logs.filter(
          (log) => log.type === 'error' || log.severity === 'error',
        ).length
        const warningCount = page.logs.filter(
          (log) => log.type === 'warning' || log.severity === 'warning',
        ).length

        return `
        <li class="page-item">
          <a href="${this.getPageReportPath(page)}" class="page-link">${this.escapeHtml(page.url)}</a>
          <span class="badge badge-${healthStatusClass.toLowerCase()}">${page.healthScore || 'N/A'}</span>
          ${errorCount > 0 ? `<span class="badge badge-error">${errorCount} errors</span>` : ''}
          ${warningCount > 0 ? `<span class="badge badge-warning">${warningCount} warnings</span>` : ''}
          <span class="badge">${page.failedRequests.length} failed requests</span>
        </li>
      `
      })
      .join('')
  }

  /**
   * Get the path to the page report
   */
  private getPageReportPath(page: PageResult): string {
    const urlObj = new URL(page.url)
    const pathParts = urlObj.pathname.split('/').filter(Boolean)
    const fileName = pathParts.length > 0 ? pathParts[pathParts.length - 1] : 'index'
    return `./${this.sanitizeFilename(fileName)}.md`
  }

  /**
   * Sanitize filename
   */
  private sanitizeFilename(filename: string): string {
    return filename.replace(/[^a-z0-9]/gi, '_').toLowerCase()
  }

  /**
   * Get health status class
   */
  private getHealthStatusClass(status: 'Good' | 'Warning' | 'Poor'): string {
    return `health-${status.toLowerCase()}`
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
  }
}
