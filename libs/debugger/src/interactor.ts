/**
 * Interactor Module for Playwright MCP Debugger
 *
 * This module provides functions for interacting with the page,
 * such as clicking elements and scrolling.
 */

import type { DebuggerConfig, Route } from './types'
import * as mcp from './mcp'

/**
 * Interact with the current page
 * @param {Route} route Current route
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function interactWithPage(route: Route, config: DebuggerConfig): Promise<void> {
  console.log(`[Interactor] Interacting with page: ${route.path}`)

  try {
    // Take a screenshot of the page
    await takeScreenshot(route, config)

    // Scroll the page to trigger lazy loading and event handlers
    await scrollPage(config)

    // Find and click on interactive elements
    await clickInteractiveElements(config)

    console.log(`[Interactor] Completed interactions for ${route.path}`)
  } catch (error: any) {
    console.error(`[Interactor] Error interacting with ${route.path}:`, error.message)
  }
}

/**
 * Take a screenshot of the current page
 * @param {Route} route Current route
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
async function takeScreenshot(route: Route, config: DebuggerConfig): Promise<void> {
  console.log(`[Interactor] Taking screenshot of ${route.path}`)

  try {
    // Create a filename from the route path
    const filename = route.path.replace(/\//g, '-').replace(/^-/, '') || 'home'

    await mcp.screenshot(
      {
        fullPage: true,
        name: filename,
        savePng: true,
      },
      config,
    )

    console.log(`[Interactor] Screenshot saved for ${route.path}`)
  } catch (error: any) {
    console.error('[Interactor] Error taking screenshot:', error.message)
  }
}

/**
 * Scroll the page to trigger lazy loading and event handlers
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
export async function scrollPage(config: DebuggerConfig): Promise<void> {
  console.log('[Interactor] Scrolling page')

  try {
    // Execute JavaScript to scroll the page
    await mcp.callMcp(
      'playwright_evaluate',
      {
        script: `
        // Scroll down in increments
        const scrollHeight = document.body.scrollHeight;
        const viewportHeight = window.innerHeight;
        const scrollSteps = 5;
        
        for (let i = 1; i <= scrollSteps; i++) {
          const scrollTo = (scrollHeight / scrollSteps) * i;
          window.scrollTo(0, scrollTo);
        }
        
        // Scroll back to top
        setTimeout(() => {
          window.scrollTo(0, 0);
        }, 500);
        
        return { scrollHeight, viewportHeight };
      `,
      },
      config,
    )

    // Wait for any lazy-loaded content to appear
    await new Promise((resolve) => setTimeout(resolve, 2000))

    console.log('[Interactor] Page scrolling complete')
  } catch (error: any) {
    console.error('[Interactor] Error scrolling page:', error.message)
  }
}

/**
 * Find and click on interactive elements
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<void>}
 */
async function clickInteractiveElements(config: DebuggerConfig): Promise<void> {
  console.log('[Interactor] Finding and clicking interactive elements')

  try {
    // Get the HTML of the page
    const htmlResponse = await mcp.getVisibleHtml({}, config)

    if (!htmlResponse.success) {
      console.error('[Interactor] Failed to get page HTML')
      return
    }

    const html = htmlResponse.result?.html || ''

    // Find clickable elements using a simple approach
    // In a real implementation, we would use a more sophisticated approach
    const clickableSelectors = findClickableSelectors(html)

    for (const selector of clickableSelectors) {
      try {
        console.log(`[Interactor] Clicking element: ${selector}`)

        // Click the element
        await mcp.click({ selector }, config)

        // Wait a moment for any effects to complete
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } catch (error: any) {
        console.error(`[Interactor] Error clicking ${selector}:`, error.message)
      }
    }

    console.log('[Interactor] Completed clicking interactive elements')
  } catch (error: any) {
    console.error('[Interactor] Error finding/clicking elements:', error.message)
  }
}

/**
 * Find clickable selectors in HTML
 * @param {string} html HTML content
 * @returns {string[]} Array of CSS selectors
 */
function findClickableSelectors(html: string): string[] {
  // This is a very simplified approach
  // In a real implementation, we would use a proper HTML parser

  // Define common clickable elements to look for
  const clickableElements = [
    'button:not([disabled])',
    'a[href]:not([disabled])',
    '.tab:not(.active)',
    '.nav-item:not(.active)',
    '.clickable',
    '[role="button"]',
    '[role="tab"]:not([aria-selected="true"])',
  ]

  // For this simplified version, we'll just return a subset of these selectors
  // In a real implementation, we would parse the HTML and find actual elements
  return clickableElements.slice(0, 3)
}
