import fs from 'fs'
import path from 'path'

/** Basic shape of our log analysis metrics in JSON */
export interface LogAnalysisResult {
  projectName: string
  date: string

  // 1) Error File Size (bytes)
  errorFileSize: number

  // 2) Number of Unique Error Messages
  uniqueErrorCount: number

  // 3) Top 3 Most Frequent Errors
  topFrequentErrors: Array<{ message: string; count: number }>

  // 4) Warning Count
  warningCount: number

  // 5) Build Duration (ms)
  buildDurationMs: number

  // 6) Exit Code
  exitCode: number

  // 7) Source of Errors: grouped by file path
  errorSources: Record<string, number>
}

/**
 * A simple class to read .log / .errors.txt and produce metrics.
 * Expand as you see fit!
 */
export class LogAnalyzer {
  /**
   * Analyze logs after the build has finished. We receive:
   *  - projectName, dateStr: for naming
   *  - logsDir: directory with the .errors.txt and .log
   *  - buildStartTs: when we started the build
   *  - buildEndTs: when the build ended
   *  - exitCode: final status code from the build
   */
  public analyzeLogs(
    projectName: string,
    dateStr: string,
    logsDir: string,
    buildStartTs: number,
    buildEndTs: number,
    exitCode: number,
  ): LogAnalysisResult {
    // Filenames
    const errorLog = path.join(logsDir, `${projectName}-${dateStr}.errors.txt`)
    const fullLog = path.join(logsDir, `${projectName}-${dateStr}.log`)

    // (1) Error File Size
    let errorFileSize = 0
    if (fs.existsSync(errorLog)) {
      const stats = fs.statSync(errorLog)
      errorFileSize = stats.size // bytes
    }

    // (5) Build Duration
    const buildDurationMs = buildEndTs - buildStartTs

    // We'll parse the error log for metrics #2, #3, #4, #7
    let uniqueErrorCount = 0
    let topFrequentErrors: Array<{ message: string; count: number }> = []
    let warningCount = 0
    const errorSources: Record<string, number> = {}

    if (fs.existsSync(errorLog)) {
      // Read entire errors file
      const errorContents = fs.readFileSync(errorLog, 'utf8')
      const lines = errorContents.split('\n').filter((l) => l.trim().length > 0)

      // We'll store frequency of each error line in a Map
      const errorFrequency = new Map<string, number>()

      // Simple regex patterns (customize to your codebase):
      //  - Warnings: lines containing "WARN" or "WARNING"
      //  - File paths: something like "src/foo/bar.ts:123"
      const warningRegex = /\b(WARN|WARNING)\b/i
      const filePathRegex = /([a-zA-Z0-9._/-]+:\d+)/g

      for (const line of lines) {
        // (4) Count warnings
        if (warningRegex.test(line)) {
          warningCount++
        }
        // (7) Group by file path
        // e.g. a line might have "src/core/logger.ts:123"
        const fileMatches = line.match(filePathRegex)
        if (fileMatches) {
          for (const match of fileMatches) {
            errorSources[match] = (errorSources[match] || 0) + 1
          }
        }

        // For "frequent error" detection, treat the entire line as an error message
        // or parse only the relevant substring
        const currentCount = errorFrequency.get(line) ?? 0
        errorFrequency.set(line, currentCount + 1)
      }

      // (2) Number of Unique Error Messages
      uniqueErrorCount = errorFrequency.size

      // (3) Top 3 most frequent errors
      // Sort by frequency desc
      const sortedErrors = [...errorFrequency.entries()].sort((a, b) => b[1] - a[1])
      topFrequentErrors = sortedErrors.slice(0, 3).map(([message, count]) => ({
        message,
        count,
      }))
    }

    return {
      projectName,
      date: dateStr,
      errorFileSize,
      uniqueErrorCount,
      topFrequentErrors,
      warningCount,
      buildDurationMs,
      exitCode,
      errorSources,
    }
  }
}
