/**
 * Logger Module for Playwright MCP Debugger
 *
 * This module provides functions for capturing and formatting console logs
 * from the browser.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { DebuggerConfig, Route } from './types'
import * as mcp from './mcp'

/**
 * Log entry structure
 */
export interface LogEntry {
  type: 'log' | 'info' | 'warning' | 'error'
  message: string
  timestamp: string
}

/**
 * Capture console logs from the current page
 * @param {Route} route Current route
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<LogEntry[]>} Array of log entries
 */
export async function captureConsoleLogs(
  route: Route,
  config: DebuggerConfig,
): Promise<LogEntry[]> {
  console.log(`[Logger] Capturing console logs for ${route.path}`)

  try {
    // Get console logs from the page
    const response = await mcp.consoleLogs(
      {
        clear: false,
        type: 'all',
      },
      config,
    )

    if (!response.success) {
      console.error('[Logger] Failed to capture console logs:', response.error)
      return []
    }

    // Extract logs from the response
    const logs = response.result?.logs || []

    // Convert to our LogEntry format
    const formattedLogs: LogEntry[] = logs.map((log: any) => ({
      type: mapLogType(log.type),
      message: log.text,
      timestamp: log.timestamp || new Date().toISOString(),
    }))

    console.log(`[Logger] Captured ${formattedLogs.length} console logs`)
    return formattedLogs
  } catch (error: any) {
    console.error('[Logger] Error capturing console logs:', error.message)
    return []
  }
}

/**
 * Save logs to a file
 * @param {LogEntry[]} logs Array of log entries
 * @param {Route} route Current route
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function saveLogs(
  logs: LogEntry[],
  route: Route,
  config: DebuggerConfig,
): Promise<void> {
  if (logs.length === 0) {
    console.log(`[Logger] No logs to save for ${route.path}`)
    return
  }

  console.log(`[Logger] Saving ${logs.length} logs for ${route.path}`)

  try {
    // Format logs
    const formattedLogs = formatLogs(logs, route)

    // Ensure the output directory exists
    const outputDir = path.dirname(config.outputPath)
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Append logs to the output file
    fs.appendFileSync(config.outputPath, formattedLogs)

    console.log(`[Logger] Logs saved to ${config.outputPath}`)
  } catch (error: any) {
    console.error('[Logger] Error saving logs:', error.message)
  }
}

/**
 * Format logs for output
 * @param {LogEntry[]} logs Array of log entries
 * @param {Route} route Current route
 * @returns {string} Formatted logs
 */
export function formatLogs(logs: LogEntry[], route: Route): string {
  const header = `\n\n## Route: ${route.path} (${route.path})\n\n`

  const formattedLogs = logs
    .map((log) => {
      const timestamp = new Date(log.timestamp).toLocaleTimeString()
      const typeIcon = getLogTypeIcon(log.type)
      return `${timestamp} ${typeIcon} ${log.message}`
    })
    .join('\n')

  return `${header}\`\`\`\n${formattedLogs}\n\`\`\`\n`
}

/**
 * Map log type from Playwright to our format
 * @param {string} type Playwright log type
 * @returns {LogEntry['type']} Our log type
 */
function mapLogType(type: string): LogEntry['type'] {
  switch (type.toLowerCase()) {
    case 'error':
      return 'error'
    case 'warning':
    case 'warn':
      return 'warning'
    case 'info':
      return 'info'
    default:
      return 'log'
  }
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
