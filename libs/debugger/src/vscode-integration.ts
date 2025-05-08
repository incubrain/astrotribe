/**
 * VS Code Integration Module for Playwright MCP Debugger
 *
 * This module provides functionality to integrate with VS Code Insiders
 * and its Playwright MCP server implementation.
 */

import { spawn, execSync } from 'child_process'
import type { ChildProcess } from 'child_process'
import type { DebuggerConfig } from './types'

// Store VS Code MCP server process
let vscodeProcess: ChildProcess | null = null

/**
 * Check if VS Code Insiders is installed
 * @returns {boolean} Whether VS Code Insiders is installed
 */
export function isVSCodeInsidersInstalled(): boolean {
  try {
    const result = execSync('which code-insiders || where code-insiders', { encoding: 'utf8' })
    return result.trim().length > 0
  } catch (error) {
    return false
  }
}

/**
 * Initialize VS Code integration
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<boolean>} Whether initialization succeeded
 */
export async function initVsCodeIntegration(config: DebuggerConfig): Promise<boolean> {
  try {
    // Check if we're already running inside VS Code
    if (process.env.VSCODE_RUNNING === 'true') {
      console.log('[VS Code] Already running inside VS Code, no need to initialize integration')
      return true
    }

    // Check if VS Code Insiders is installed
    const useInsiders = config.vscodeIntegration?.useInsiders ?? true
    const vscodeCommand = useInsiders ? 'code-insiders' : 'code'

    

    if (useInsiders && !isVSCodeInsidersInstalled()) {
      console.error(`[VS Code] ${vscodeCommand} is not installed`)
      return false
    }

    console.log(`[VS Code] Initializing ${vscodeCommand} integration...`)

    // Start VS Code with the Playwright MCP server command
    const args = [
      '--force-new-instance',
      '--profile=debugger',
      '--execute-command=playwright-mcp.start',
    ]

    vscodeProcess = spawn(vscodeCommand, args, {
      detached: true,
      stdio: 'pipe',
    })

    // Set up event handlers
    vscodeProcess.stdout?.on('data', (data) => {
      console.log(`[VS Code Output] ${data.toString().trim()}`)
    })

    vscodeProcess.stderr?.on('data', (data) => {
      console.error(`[VS Code Error] ${data.toString().trim()}`)
    })

    vscodeProcess.on('error', (error) => {
      console.error(`[VS Code] Failed to start: ${error.message}`)
    })

    vscodeProcess.on('close', (code) => {
      console.log(`[VS Code] Process exited with code ${code}`)
      vscodeProcess = null
    })

    // Wait a moment for the server to initialize
    await new Promise((resolve) => setTimeout(resolve, 5000))

    return true
  } catch (error: any) {
    console.error(`[VS Code] Integration initialization failed: ${error.message}`)
    return false
  }
}

/**
 * Get the MCP server URL from VS Code Insiders
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {string} The MCP server URL
 */
export function getMcpServerUrl(config: DebuggerConfig): string {
  // If a custom MCP server URL is provided in the config, use it
  if (config.mcpServerUrl && config.mcpServerUrl !== 'http://localhost:3333/api/call') {
    return config.mcpServerUrl
  }

  // Default URL for VS Code Insiders Playwright MCP server
  return 'http://localhost:9222/mcp'
}

/**
 * Close the VS Code integration
 * @returns {Promise<boolean>} Whether closing succeeded
 */
export async function closeVsCodeIntegration(): Promise<boolean> {
  if (!vscodeProcess) {
    return true
  }

  try {
    // Try to close VS Code gracefully
    vscodeProcess.kill()
    vscodeProcess = null

    return true
  } catch (error: any) {
    console.error(`[VS Code] Error closing integration: ${error.message}`)
    
    // Force kill if needed
    if (vscodeProcess) {
      try {
        vscodeProcess.kill('SIGKILL')
      } catch (e) {
        // Ignore errors on force kill
      }
      vscodeProcess = null
    }
    
    return false
  }
}

/**
 * Show a notification when running inside VS Code
 * @param {string} message The message to show
 * @param {boolean} isError Whether this is an error notification
 */
export function showNotification(message: string, isError: boolean = false): void {
  if (process.env.VSCODE_RUNNING === 'true') {
    // When running inside VS Code, this is just a fallback to console
    // In a real extension, you would use vscode.window.showInformationMessage
    if (isError) {
      console.error(`[VS Code Notification] ${message}`)
    } else {
      console.log(`[VS Code Notification] ${message}`)
    }
  } else {
    // Regular console output when running outside VS Code
    if (isError) {
      console.error(message)
    } else {
      console.log(message)
    }
  }
}
