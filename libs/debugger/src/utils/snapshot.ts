/**
 * Snapshot Module for Playwright MCP Debugger
 *
 * This module provides functions for capturing snapshots and screenshots
 * using the Playwright MCP server.
 */

import path from 'path'
import fs from 'fs'
import { callMcp } from '../mcp'
import type { DebuggerConfig } from '../types'

/**
 * Capture an accessibility snapshot of the current page
 * @returns {Promise<{success: boolean, html: string}>} Result of the snapshot operation
 */
export async function captureSnapshot(config: DebuggerConfig) {
  console.log('Capturing accessibility snapshot...')

  try {
    // Get the HTML content using MCP
    const result = await callMcp('playwright_get_visible_html', {}, config)

    return {
      success: true,
      html: result.result,
    }
  } catch (error: any) {
    console.error('Snapshot capture failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Take a screenshot of the current page
 * @param {string} name Name for the screenshot
 * @param {boolean} fullPage Whether to capture the full page
 * @returns {Promise<{success: boolean, name: string, path: string}>} Result of the screenshot operation
 */
export async function takeScreenshot(
  name: string,
  fullPage: boolean = true,
  config: DebuggerConfig,
) {
  console.log(`Taking screenshot ${name}...`)

  try {
    // Create screenshots directory if it doesn't exist
    const screenshotsDir = path.join(process.cwd(), 'debug', 'screenshots')
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true })
    }

    // Use MCP browser_screenshot tool
    await callMcp(
      'playwright_screenshot',
      {
        name,
        fullPage,
        savePng: true,
      },
      config,
    )

    const screenshotPath = path.join(screenshotsDir, `${name}.png`)

    return {
      success: true,
      name,
      path: screenshotPath,
    }
  } catch (error: any) {
    console.error(`Screenshot ${name} failed:`, error)
    return {
      success: false,
      name,
      error: error.message,
    }
  }
}

/**
 * Get the visible text content of the current page
 * @returns {Promise<{success: boolean, text: string}>} Result of the text capture operation
 */
export async function getVisibleText(config: DebuggerConfig) {
  console.log('Getting visible text content...')

  try {
    // Use MCP browser_get_visible_text tool
    const result = await callMcp('playwright_get_visible_text', {}, config)

    return {
      success: true,
      text: result.result,
    }
  } catch (error: any) {
    console.error('Get visible text failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

/**
 * Save the current page as a PDF
 * @param {string} filename Name of the PDF file
 * @returns {Promise<{success: boolean, path: string}>} Result of the PDF save operation
 */
export async function saveAsPdf(filename: string = 'page.pdf', config: DebuggerConfig) {
  console.log(`Saving page as PDF: ${filename}...`)

  try {
    // Create output directory if it doesn't exist
    const outputDir = path.join(process.cwd(), 'debug', 'output')
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true })
    }

    // Use MCP browser_save_as_pdf tool
    await callMcp(
      'playwright_save_as_pdf',
      {
        filename,
        outputPath: outputDir,
        format: 'A4',
        printBackground: true,
      },
      config,
    )

    const pdfPath = path.join(outputDir, filename)

    return {
      success: true,
      path: pdfPath,
    }
  } catch (error: any) {
    console.error('Save as PDF failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}
