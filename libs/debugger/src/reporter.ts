/**
 * Reporter Module for Playwright MCP Debugger
 *
 * This module provides functions for formatting and outputting logs
 * and reports from the debugger.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { DebuggerConfig, Route } from './types'
import type { LogEntry } from './logger'

/**
 * Initialize the report file
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function initReport(config: DebuggerConfig): Promise<void> {
  console.log(`[Reporter] Initializing report at ${config.outputPath}`)

  try {
    // Ensure the output directory exists
    const outputDir = path.dirname(config.outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Create the report file with a header
    const header = `# AstroTribe Debugger Report\n\nGenerated: ${new Date().toLocaleString()}\n\n`
    fs.writeFileSync(config.outputPath, header)

    console.log(`[Reporter] Report initialized at ${config.outputPath}`)
  } catch (error: any) {
    console.error('[Reporter] Error initializing report:', error.message)
  }
}

/**
 * Add a section to the report
 * @param {string} title Section title
 * @param {string} content Section content
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function addReportSection(
  title: string,
  content: string,
  config: DebuggerConfig,
): Promise<void> {
  console.log(`[Reporter] Adding section "${title}" to report`)

  try {
    // Format the section
    const section = `\n## ${title}\n\n${content}\n`

    // Append to the report file
    fs.appendFileSync(config.outputPath, section)

    console.log(`[Reporter] Section "${title}" added to report`)
  } catch (error: any) {
    console.error(`[Reporter] Error adding section "${title}":`, error.message)
  }
}

/**
 * Add route logs to the report
 * @param {LogEntry[]} logs Array of log entries
 * @param {Route} route Current route
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function addRouteLogsToReport(
  logs: LogEntry[],
  route: Route,
  config: DebuggerConfig,
): Promise<void> {
  if (logs.length === 0) {
    console.log(`[Reporter] No logs to add for ${route.path}`)
    return
  }

  console.log(`[Reporter] Adding ${logs.length} logs for ${route.path} to report`)

  try {
    // Format the logs
    const formattedLogs = formatRouteLogs(logs, route)

    // Append to the report file
    fs.appendFileSync(config.outputPath, formattedLogs)

    console.log(`[Reporter] Logs for ${route.path} added to report`)
  } catch (error: any) {
    console.error(`[Reporter] Error adding logs for ${route.path}:`, error.message)
  }
}

/**
 * Format route logs for the report
 * @param {LogEntry[]} logs Array of log entries
 * @param {Route} route Current route
 * @returns {string} Formatted logs
 */
export function formatRouteLogs(logs: LogEntry[], route: Route): string {
  const header = `\n\n## Route: ${route.path} (${route.path})\n\n`

  // Group logs by type
  const errorLogs = logs.filter((log) => log.type === 'error')
  const warningLogs = logs.filter((log) => log.type === 'warning')
  const infoLogs = logs.filter((log) => log.type === 'info')
  const regularLogs = logs.filter((log) => log.type === 'log')

  // Create summary
  const summary = [
    `Total logs: ${logs.length}`,
    `Errors: ${errorLogs.length}`,
    `Warnings: ${warningLogs.length}`,
    `Info: ${infoLogs.length}`,
    `Regular: ${regularLogs.length}`,
  ].join(' | ')

  // Format the logs by type
  let formattedContent = `${summary}\n\n`

  // Add errors first (if any)
  if (errorLogs.length > 0) {
    formattedContent += `### Errors\n\n\`\`\`\n${formatLogEntries(errorLogs)}\n\`\`\`\n\n`
  }

  // Add warnings (if any)
  if (warningLogs.length > 0) {
    formattedContent += `### Warnings\n\n\`\`\`\n${formatLogEntries(warningLogs)}\n\`\`\`\n\n`
  }

  // Add info and regular logs together (if any)
  const otherLogs = [...infoLogs, ...regularLogs]
  if (otherLogs.length > 0) {
    formattedContent += `### Other Logs\n\n\`\`\`\n${formatLogEntries(otherLogs)}\n\`\`\`\n\n`
  }

  return `${header}${formattedContent}`
}

/**
 * Format log entries
 * @param {LogEntry[]} logs Array of log entries
 * @returns {string} Formatted log entries
 */
function formatLogEntries(logs: LogEntry[]): string {
  return logs
    .map((log) => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString()
      const typeIcon = getLogTypeIcon(log.type)
      return `${timestamp} ${typeIcon} ${log.message}`
    })
    .join('\n')
}

/**
 * Get an icon for a log type
 * @param {LogEntry['type']} type Log type
 * @returns {string} Icon
 */
function getLogTypeIcon(type: LogEntry['type']): string {
  switch (type) {
    case 'error':
      return '❌'
    case 'warning':
      return '⚠️'
    case 'info':
      return 'ℹ️'
    default:
      return '📝'
  }
}

/**
 * Finalize the report
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function finalizeReport(config: DebuggerConfig): Promise<void> {
  console.log(`[Reporter] Finalizing report at ${config.outputPath}`)

  try {
    // Add a footer to the report
    const footer = `\n\n## Summary\n\nDebugger run completed at ${new Date().toLocaleString()}\n`
    fs.appendFileSync(config.outputPath, footer)

    console.log(`[Reporter] Report finalized at ${config.outputPath}`)
  } catch (error: any) {
    console.error('[Reporter] Error finalizing report:', error.message)
  }
}
