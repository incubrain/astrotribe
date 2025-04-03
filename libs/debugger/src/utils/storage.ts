/**
 * Storage Module for Playwright MCP Debugger
 *
 * This module provides functions for writing logs and snapshots to files.
 */

import * as fs from 'fs'
import * as path from 'path'
import type { LogEntry } from '../logger'

/**
 * Save test result to a file
 * @param {string} testName Name of the test
 * @param {any} result Test result
 * @returns {string} Path to the saved file
 */
export function saveTestResult(testName: string, result: any): string {
  try {
    const timestamp = new Date().toISOString()
    const fileName = `${testName}_${timestamp}.json`
    const filePath = path.join(process.cwd(), 'debug', 'output', 'results', fileName)

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write result to file
    fs.writeFileSync(filePath, JSON.stringify(result, null, 2))

    console.log(`Saved test result for ${testName}...`)
    return filePath
  } catch (error) {
    console.error('Error saving test result:', error)
    return ''
  }
}

/**
 * Save logs to a file
 * @param {LogEntry[]} logs Logs to save
 * @param {string} route Route that generated the logs
 * @param {string} filePath Path to save logs to
 * @returns {boolean} Whether the save was successful
 */
export function saveLogs(logs: LogEntry[], route: string, filePath: string): boolean {
  try {
    // Create directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Check if file exists
    if (!fs.existsSync(filePath)) {
      // Create file with header
      fs.writeFileSync(filePath, `# Logs for ${route}\n\n`)
    }

    // Format logs
    const formattedLogs = logs
      .map((log) => {
        const icon =
          log.type === 'error'
            ? '❌'
            : log.type === 'warning'
              ? '⚠️'
              : log.type === 'info'
                ? 'ℹ️'
                : '📝'
        return `${icon} **${log.type.toUpperCase()}** (${log.timestamp}): ${log.message}`
      })
      .join('\n\n')

    // Append logs to file
    fs.appendFileSync(filePath, `\n\n## Logs for route ${route}\n\n${formattedLogs}\n\n---\n\n`)

    console.log(`Writing ${logs.length} logs for route ${route} to ${path.basename(filePath)}...`)
    return true
  } catch (error) {
    console.error('Error saving logs:', error)
    return false
  }
}

/**
 * Save HTML snapshot to a file
 * @param {any} htmlContent HTML content to save
 * @param {string} route Route that generated the snapshot
 * @returns {string} Path to the saved file
 */
export function saveHtmlSnapshot(htmlContent: any, route: string): string {
  try {
    const timestamp = new Date().toISOString()
    const fileName = `${route.replace(/\//g, '-')}_${timestamp}.html`
    const filePath = path.join(process.cwd(), 'debug', 'output', 'snapshots', fileName)

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Extract HTML content from different response formats
    let html = ''

    if (typeof htmlContent === 'string') {
      html = htmlContent
    } else if (htmlContent && typeof htmlContent === 'object') {
      // Handle different response formats
      if (htmlContent.html) {
        html = htmlContent.html
      } else if (htmlContent.result && htmlContent.result.html) {
        html = htmlContent.result.html
      } else if (htmlContent.result && typeof htmlContent.result === 'string') {
        html = htmlContent.result
      } else {
        html = JSON.stringify(htmlContent, null, 2)
      }
    } else {
      html = 'No HTML content available'
    }

    // Write HTML to file
    fs.writeFileSync(filePath, html)

    console.log(`Saving HTML snapshot for route ${route}...`)
    return filePath
  } catch (error) {
    console.error('Error saving HTML snapshot:', error)
    return ''
  }
}

/**
 * Save text content to a file
 * @param {string} textContent Text content to save
 * @param {string} route Route that generated the text
 * @returns {string} Path to the saved file
 */
export function saveTextContent(textContent: string, route: string): string {
  try {
    const timestamp = new Date().toISOString()
    const fileName = `${route.replace(/\//g, '-')}_${timestamp}.txt`
    const filePath = path.join(process.cwd(), 'debug', 'output', 'text', fileName)

    // Create directory if it doesn't exist
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    // Write text to file
    fs.writeFileSync(filePath, textContent)

    console.log(`Saved text content for route ${route}...`)
    return filePath
  } catch (error) {
    console.error('Error saving text content:', error)
    return ''
  }
}
