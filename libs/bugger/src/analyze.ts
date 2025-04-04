// src/analyze.ts
import fs from 'fs'
import path from 'path'
import { createLogger, format, transports } from 'winston'

// Setup logger
const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`
    }),
  ),
  transports: [new transports.Console(), new transports.File({ filename: 'analysis.log' })],
})

interface LogEntry {
  type: string
  text: string
  location?: string
  timestamp: string
}

interface FailedRequest {
  url: string
  method: string
  resourceType: string
  errorText: string
  status?: number
  timestamp: string
}

interface PageResult {
  url: string
  title: string
  status: 'success' | 'error'
  error?: string
  logs: LogEntry[]
  failedRequests: FailedRequest[]
  screenshot: string
  timestamp: string
}

interface CrawlSummary {
  startUrl: string
  totalPagesVisited: number
  timestamp: string
  results: PageResult[]
}

interface AnalysisOptions {
  summaryPath: string
  outputPath?: string
  errorThreshold?: number
  warningThreshold?: number
}

interface AnalysisResult {
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
}

async function analyzeResults(options: AnalysisOptions): Promise<AnalysisResult> {
  try {
    logger.info(`Analyzing results from ${options.summaryPath}`)

    // Load summary file
    if (!fs.existsSync(options.summaryPath)) {
      throw new Error(`Summary file not found: ${options.summaryPath}`)
    }

    const summaryContent = fs.readFileSync(options.summaryPath, 'utf-8')
    const summary: CrawlSummary = JSON.parse(summaryContent)

    // Initialize analysis
    const analysis: AnalysisResult = {
      totalPages: summary.totalPagesVisited,
      errorPages: 0,
      warnPages: 0,
      totalErrors: 0,
      totalWarnings: 0,
      totalFailedRequests: 0,
      commonErrors: [],
      commonErrorPatterns: [],
      pagesRanked: [],
    }

    // Error message tracking
    const errorMessages: Record<string, number> = {}

    // Error patterns (simplified for common errors)
    const errorPatterns: Record<string, number> = {
      'TypeError:': 0,
      'ReferenceError:': 0,
      'Cannot read properties': 0,
      'undefined is not': 0,
      'null is not': 0,
      'Uncaught': 0,
      'NetworkError': 0,
      'ChunkLoadError': 0,
      'Failed to fetch': 0,
      'CORS error': 0,
    }

    // Analyze each page
    for (const page of summary.results) {
      let pageErrorCount = 0
      let pageWarningCount = 0

      // Count console errors and warnings
      for (const log of page.logs) {
        if (log.type === 'error') {
          analysis.totalErrors++
          pageErrorCount++

          // Track error message frequency
          const simplifiedMessage = log.text.substring(0, 100) // Truncate for grouping
          errorMessages[simplifiedMessage] = (errorMessages[simplifiedMessage] || 0) + 1

          // Check for common error patterns
          for (const pattern of Object.keys(errorPatterns)) {
            if (log.text.includes(pattern)) {
              errorPatterns[pattern]++
            }
          }
        } else if (log.type === 'warning') {
          analysis.totalWarnings++
          pageWarningCount++
        }
      }

      // Count failed requests
      const failedRequestCount = page.failedRequests.length
      analysis.totalFailedRequests += failedRequestCount

      // Mark pages with errors or warnings
      if (pageErrorCount > 0) {
        analysis.errorPages++
      }

      if (pageWarningCount > 0) {
        analysis.warnPages++
      }

      // Add to ranked pages list
      analysis.pagesRanked.push({
        url: page.url,
        errorCount: pageErrorCount,
        warningCount: pageWarningCount,
        failedRequestCount: failedRequestCount,
      })
    }

    // Sort pages by error count (descending)
    analysis.pagesRanked.sort((a, b) => {
      return (
        b.errorCount - a.errorCount ||
        b.failedRequestCount - a.failedRequestCount ||
        b.warningCount - a.warningCount
      )
    })

    // Get most common errors
    analysis.commonErrors = Object.entries(errorMessages)
      .map(([error, count]) => ({ error, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10)

    // Get most common error patterns
    analysis.commonErrorPatterns = Object.entries(errorPatterns)
      .filter(([_, count]) => count > 0)
      .map(([pattern, count]) => ({ pattern, count }))
      .sort((a, b) => b.count - a.count)

    // Write analysis to file if requested
    if (options.outputPath) {
      fs.writeFileSync(options.outputPath, JSON.stringify(analysis, null, 2))
      logger.info(`Analysis written to ${options.outputPath}`)
    }

    // Check thresholds
    const errorThreshold = options.errorThreshold || 0
    const warningThreshold = options.warningThreshold || 0

    if (analysis.totalErrors > errorThreshold) {
      logger.warn(
        `Error threshold exceeded: ${analysis.totalErrors} errors (threshold: ${errorThreshold})`,
      )
    }

    if (analysis.totalWarnings > warningThreshold) {
      logger.warn(
        `Warning threshold exceeded: ${analysis.totalWarnings} warnings (threshold: ${warningThreshold})`,
      )
    }

    return analysis
  } catch (error) {
    logger.error(`Analysis failed: ${error instanceof Error ? error.message : String(error)}`)
    throw error
  }
}

// Generate HTML report
async function generateReport(
  analysisResult: AnalysisResult,
  crawlSummary: CrawlSummary,
  outputPath: string,
): Promise<void> {
  try {
    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Website Crawler Analysis Report</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background-color: #fff;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        h1, h2, h3 {
            color: #2c3e50;
        }
        h1 {
            border-bottom: 2px solid #ecf0f1;
            padding-bottom: 10px;
            margin-top: 0;
        }
        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        .stat-card {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            text-align: center;
        }
        .stat-card h3 {
            margin: 0;
            font-size: 16px;
            color: #7f8c8d;
        }
        .stat-card p {
            margin: 10px 0 0;
            font-size: 24px;
            font-weight: bold;
            color: #2c3e50;
        }
        .stat-card.error p {
            color: #e74c3c;
        }
        .stat-card.warning p {
            color: #f39c12;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f5f5f5;
        }
        .error-count {
            color: #e74c3c;
            font-weight: bold;
        }
        .warning-count {
            color: #f39c12;
            font-weight: bold;
        }
        .timestamp {
            color: #7f8c8d;
            margin-top: 5px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Website Crawler Analysis Report</h1>
        <p>Analysis of <strong>${crawlSummary.startUrl}</strong></p>
        <p class="timestamp">Generated: ${new Date().toISOString()}</p>
        <p class="timestamp">Crawl performed: ${crawlSummary.timestamp}</p>
        
        <div class="summary">
            <div class="stat-card">
                <h3>Total Pages</h3>
                <p>${analysisResult.totalPages}</p>
            </div>
            <div class="stat-card error">
                <h3>Pages with Errors</h3>
                <p>${analysisResult.errorPages}</p>
            </div>
            <div class="stat-card warning">
                <h3>Pages with Warnings</h3>
                <p>${analysisResult.warnPages}</p>
            </div>
            <div class="stat-card error">
                <h3>Total Errors</h3>
                <p>${analysisResult.totalErrors}</p>
            </div>
            <div class="stat-card warning">
                <h3>Total Warnings</h3>
                <p>${analysisResult.totalWarnings}</p>
            </div>
            <div class="stat-card">
                <h3>Failed Requests</h3>
                <p>${analysisResult.totalFailedRequests}</p>
            </div>
        </div>
        
        <h2>Pages Ranked by Issues</h2>
        <table>
            <tr>
                <th>URL</th>
                <th>Errors</th>
                <th>Warnings</th>
                <th>Failed Requests</th>
            </tr>
            ${analysisResult.pagesRanked
              .map(
                (page) => `
            <tr>
                <td><a href="${page.url}" target="_blank">${page.url}</a></td>
                <td class="error-count">${page.errorCount}</td>
                <td class="warning-count">${page.warningCount}</td>
                <td>${page.failedRequestCount}</td>
            </tr>
            `,
              )
              .join('')}
        </table>
        
        <h2>Common Errors</h2>
        ${
          analysisResult.commonErrors.length > 0
            ? `
        <table>
            <tr>
                <th>Error Message</th>
                <th>Count</th>
            </tr>
            ${analysisResult.commonErrors
              .map(
                (item) => `
            <tr>
                <td>${item.error}</td>
                <td>${item.count}</td>
            </tr>
            `,
              )
              .join('')}
        </table>
        `
            : '<p>No common errors found.</p>'
        }
        
        <h2>Common Error Patterns</h2>
        ${
          analysisResult.commonErrorPatterns.length > 0
            ? `
        <table>
            <tr>
                <th>Pattern</th>
                <th>Count</th>
            </tr>
            ${analysisResult.commonErrorPatterns
              .map(
                (item) => `
            <tr>
                <td>${item.pattern}</td>
                <td>${item.count}</td>
            </tr>
            `,
              )
              .join('')}
        </table>
        `
            : '<p>No common error patterns found.</p>'
        }
    </div>
</body>
</html>
`

    fs.writeFileSync(outputPath, html)
    logger.info(`HTML report generated at ${outputPath}`)
  } catch (error) {
    logger.error(
      `Error generating report: ${error instanceof Error ? error.message : String(error)}`,
    )
    throw error
  }
}

// CLI entry point
async function main() {
  try {
    const args = process.argv.slice(2)
    const summaryPath = args[0] || './results/summary.json'
    const outputPath = args[1] || './analysis-results.json'
    const reportPath = args[2] || './report.html'

    logger.info(`Starting analysis of ${summaryPath}`)

    // Load the crawl summary
    const summaryContent = fs.readFileSync(summaryPath, 'utf-8')
    const crawlSummary: CrawlSummary = JSON.parse(summaryContent)

    // Run analysis
    const analysis = await analyzeResults({
      summaryPath,
      outputPath,
      errorThreshold: 10,
      warningThreshold: 20,
    })

    // Generate HTML report
    await generateReport(analysis, crawlSummary, reportPath)

    logger.info(
      `Analysis complete. Found ${analysis.totalErrors} errors and ${analysis.totalWarnings} warnings across ${analysis.totalPages} pages.`,
    )
  } catch (error) {
    logger.error(`Error in main: ${error instanceof Error ? error.message : String(error)}`)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export { analyzeResults, generateReport }
