/**
 * Interaction Module for Playwright MCP Debugger
 *
 * This module provides functions for interacting with elements on the page
 * using the Playwright MCP server.
 */

import { callMcp } from '../mcp'

/**
 * Click on elements matching the selector
 * @param {string} selector CSS selector for the element to click
 * @returns {Promise<{success: boolean, selector: string}>} Result of the click operation
 */
export async function clickElements(selector: string) {
  console.log(`Clicking elements matching ${selector}...`)

  try {
    // Use MCP browser_click tool
    await callMcp('playwright_click', {
      selector,
    })

    return {
      success: true,
      selector,
    }
  } catch (error: any) {
    console.error(`Click on ${selector} failed:`, error)
    return {
      success: false,
      selector,
      error: error.message,
    }
  }
}

/**
 * Fill a form field
 * @param {string} selector CSS selector for the input field
 * @param {string} value Value to fill
 * @returns {Promise<{success: boolean, selector: string, value: string}>} Result of the fill operation
 */
export async function fillField(selector: string, value: string) {
  console.log(`Filling ${selector} with ${value}...`)

  try {
    // Use MCP browser_fill tool
    await callMcp('playwright_fill', {
      selector,
      value,
    })

    return {
      success: true,
      selector,
      value,
    }
  } catch (error: any) {
    console.error(`Fill ${selector} failed:`, error)
    return {
      success: false,
      selector,
      value,
      error: error.message,
    }
  }
}

/**
 * Hover over an element
 * @param {string} selector CSS selector for the element to hover
 * @returns {Promise<{success: boolean, selector: string}>} Result of the hover operation
 */
export async function hoverElement(selector: string) {
  console.log(`Hovering over ${selector}...`)

  try {
    // Use MCP browser_hover tool
    await callMcp('playwright_hover', {
      selector,
    })

    return {
      success: true,
      selector,
    }
  } catch (error: any) {
    console.error(`Hover over ${selector} failed:`, error)
    return {
      success: false,
      selector,
      error: error.message,
    }
  }
}

/**
 * Press a key
 * @param {string} key Key to press (e.g. 'Enter', 'ArrowDown', 'a')
 * @param {string} selector Optional CSS selector to focus before pressing key
 * @returns {Promise<{success: boolean, key: string}>} Result of the key press operation
 */
export async function pressKey(key: string, selector?: string) {
  console.log(`Pressing key ${key}${selector ? ` on ${selector}` : ''}...`)

  try {
    // Use MCP browser_press_key tool
    await callMcp('playwright_press_key', {
      key,
      selector,
    })

    return {
      success: true,
      key,
      selector,
    }
  } catch (error: any) {
    console.error(`Press key ${key} failed:`, error)
    return {
      success: false,
      key,
      selector,
      error: error.message,
    }
  }
}

/**
 * Select an option from a dropdown
 * @param {string} selector CSS selector for the select element
 * @param {string} value Value to select
 * @returns {Promise<{success: boolean, selector: string, value: string}>} Result of the select operation
 */
export async function selectOption(selector: string, value: string) {
  console.log(`Selecting ${value} from ${selector}...`)

  try {
    // Use MCP browser_select tool
    await callMcp('playwright_select', {
      selector,
      value,
    })

    return {
      success: true,
      selector,
      value,
    }
  } catch (error: any) {
    console.error(`Select ${value} from ${selector} failed:`, error)
    return {
      success: false,
      selector,
      value,
      error: error.message,
    }
  }
}
