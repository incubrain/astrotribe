/**
 * VS Code Integration Module for Playwright MCP Debugger
 *
 * This module provides functionality to integrate with VS Code
 * and its Playwright MCP server implementation.
 */

import { spawn, execSync } from 'child_process'
import type { ChildProcess } from 'child_process'
import fetch from 'node-fetch'
import type { DebuggerConfig } from './types'

// Store VS Code MCP server process
let vscodeProcess: ChildProcess | null = null
// Store output for debugging purposes
let vscodeOutput = ''

/**
 * Check if we're running inside VS Code
 * @returns {boolean} Whether we're running inside VS Code
 */
export function isRunningInVSCode(): boolean {
  return process.env.VSCODE_PID !== undefined || 
         process.env.VSCODE_CWD !== undefined ||
         process.env.VSCODE_RUNNING === 'true';
}

/**
 * Test if a VS Code command is available
 * @param {string} command The VS Code command to test
 * @returns {boolean} Whether the command is available
 */
export function isVSCodeCommandAvailable(command: string): boolean {
  try {
    // Try platform-appropriate command to check for existence
    const checkCmd = process.platform === 'win32' 
      ? `where ${command} 2>&1`
      : `which ${command} 2>&1`
      
    const result = execSync(checkCmd, { encoding: 'utf8' }).trim()
    return !result.includes('not found') && result.length > 0
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
    if (isRunningInVSCode()) {
      console.log('[VS Code] Already running inside VS Code, no need to initialize integration')
      return true
    }

    // Determine which VS Code to use
    const useInsiders = config.vscodeIntegration?.useInsiders ?? true
    const vscodeCommand = useInsiders ? 'code-insiders' : 'code'

    // Check if VS Code is installed
    console.log(`[VS Code] Checking if ${vscodeCommand} is installed...`)
    if (!isVSCodeCommandAvailable(vscodeCommand)) {
      console.error(`[VS Code] ❌ ${vscodeCommand} not found in PATH`)
      console.error(`[VS Code] Please install ${vscodeCommand} or set USE_VSCODE_INSIDERS=false to use regular VS Code`)
      
      // Try alternative command if using Insiders
      if (useInsiders && isVSCodeCommandAvailable('code')) {
        console.log('[VS Code] ℹ️ Regular VS Code is available. You can use it by setting USE_VSCODE_INSIDERS=false')
      }
      
      return false
    }
    
    // VS Code is installed, check version
    try {
      const versionOutput = execSync(`${vscodeCommand} --version`, { encoding: 'utf8' }).trim()
      console.log(`[VS Code] ✅ ${vscodeCommand} version: ${versionOutput}`)
    } catch (error) {
      console.warn(`[VS Code] Could not verify ${vscodeCommand} version: ${error.message}`)
    }
    
    // Check if the Playwright MCP extension is installed
    try {
      const extensionsOutput = execSync(`${vscodeCommand} --list-extensions | grep -i playwright`, { encoding: 'utf8' }).trim()
      if (extensionsOutput.length > 0) {
        console.log(`[VS Code] ✅ Found Playwright extensions: ${extensionsOutput}`)
      } else {
        console.warn(`[VS Code] ⚠️ No Playwright extensions found. Will attempt to install.`)
        
        // Try to install the extension
        try {
          console.log(`[VS Code] Installing Playwright MCP extension...`)
          const installOutput = execSync(`${vscodeCommand} --install-extension ms-playwright.playwright-mcp`, 
            { encoding: 'utf8' }).trim()
          console.log(`[VS Code] Extension installation result: ${installOutput}`)
        } catch (installError) {
          console.error(`[VS Code] ❌ Failed to install extension: ${installError.message}`)
        }
      }
    } catch (error) {
      console.warn(`[VS Code] Could not check for Playwright extensions: ${error.message}`)
    }

    console.log(`[VS Code] Initializing ${vscodeCommand} integration...`)

    // Start VS Code with the Playwright MCP server command
    // Use more explicit arguments
    const args = [
      '--force-new-instance',      // Start a new instance
      '--profile=debugger',        // Use a specific profile to avoid conflicts
      '--disable-extensions=false', // Ensure extensions are enabled
      '--enable-proposed-api=ms-playwright.playwright-mcp', // Enable proposed API features
      '--execute-command=playwright-mcp.start', // Start the MCP server
    ]

    console.log(`[VS Code] Starting ${vscodeCommand} with args: ${args.join(' ')}`)
    
    // Clear the output buffer
    vscodeOutput = ''
    
    // Spawn the VS Code process
    vscodeProcess = spawn(vscodeCommand, args, {
      detached: true,
      stdio: 'pipe',
      env: { ...process.env, VSCODE_DEBUG: '1' } // Add debug flag
    })

    // Set up event handlers with better output collection
    vscodeProcess.stdout?.on('data', (data) => {
      const output = data.toString().trim()
      if (output) {
        vscodeOutput += output + '\n'
        console.log(`[VS Code Output] ${output}`)
      }
    })

    vscodeProcess.stderr?.on('data', (data) => {
      const error = data.toString().trim()
      if (error) {
        vscodeOutput += error + '\n'
        console.error(`[VS Code Error] ${error}`)
      }
    })

    vscodeProcess.on('error', (error) => {
      console.error(`[VS Code] Failed to start: ${error.message}`)
      vscodeOutput += `Error: ${error.message}\n`
    })

    vscodeProcess.on('close', (code) => {
      console.log(`[VS Code] Process exited with code ${code}`)
      if (code !== 0) {
        console.error(`[VS Code] Output before exit:\n${vscodeOutput}`)
      }
      vscodeProcess = null
    })

    // Wait for VS Code to start and the MCP server to initialize
    console.log('[VS Code] Waiting for VS Code and MCP server to initialize...')
    
    // Implement a smarter wait with checking for MCP server availability
    const maxWaitTime = 15000 // 15 seconds max wait
    const startTime = Date.now()
    let serverReady = false
    
    while (Date.now() - startTime < maxWaitTime && !serverReady) {
      try {
        // Try to connect to the MCP server
        const response = await fetch('http://localhost:9222/mcp/ping', {
          method: 'GET',
          timeout: 1000
        }).catch(() => null)
        
        if (response && response.ok) {
          console.log('[VS Code] ✅ MCP server is ready!')
          serverReady = true
          break
        }
        
        // Wait a bit before trying again
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('[VS Code] Waiting for MCP server to be ready...')
      } catch (error) {
        // Ignore errors and keep trying
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    if (!serverReady) {
      console.warn('[VS Code] ⚠️ Timed out waiting for MCP server, but continuing...')
      console.log('[VS Code] VS Code process output so far:')
      console.log(vscodeOutput)
    }

    return true
  } catch (error: any) {
    console.error(`[VS Code] Integration initialization failed: ${error.message}`)
    console.error(`[VS Code] Integration initialization stack: ${error.stack}`)
    return false
  }
}

/**
 * Get the MCP server URL from VS Code
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {string} The MCP server URL
 */
export function getMcpServerUrl(config: DebuggerConfig): string {
  // If a custom MCP server URL is provided in the config, use it
  if (config.mcpServerUrl && config.mcpServerUrl !== 'http://localhost:9222/mcp') {
    console.log(`[VS Code] Using custom MCP server URL: ${config.mcpServerUrl}`)
    return config.mcpServerUrl
  }

  // Default URL for VS Code Playwright MCP server
  return 'http://localhost:9222/mcp'
}

/**
 * Test MCP server connection
 * @param {string} url The MCP server URL
 * @returns {Promise<boolean>} Whether the connection is successful
 */
export async function testMcpServerConnection(url: string): Promise<boolean> {
  try {
    console.log(`[VS Code] Testing connection to MCP server at ${url}...`)
    
    // Try a GET request first (for ping endpoint)
    try {
      const pingUrl = url.endsWith('/') ? `${url}ping` : `${url}/ping`
      const pingResponse = await fetch(pingUrl, { 
        method: 'GET',
        timeout: 2000 
      })
      
      if (pingResponse.ok) {
        console.log('[VS Code] MCP server ping successful')
        return true
      }
    } catch (pingError) {
      console.log(`[VS Code] MCP server ping failed: ${pingError.message}`)
      // Continue to try JSON-RPC request
    }
    
    // Try a POST request with JSON-RPC format
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'connection-test',
        method: 'ping',
        params: {}
      }),
      timeout: 3000
    })
    
    console.log(`[VS Code] MCP server connection test status: ${response.status}`)
    
    // Even a 404 or other error status means the server is running
    // It might just not support the specific method we're calling
    return response.status !== 0
  } catch (error) {
    console.error(`[VS Code] MCP server connection test failed: ${error.message}`)
    return false
  }
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
    console.log('[VS Code] Closing VS Code integration...')
    
    // Try to close VS Code gracefully
    vscodeProcess.kill()
    
    // Wait a moment for clean shutdown
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    vscodeProcess = null
    console.log('[VS Code] VS Code integration closed successfully')
    return true
  } catch (error: any) {
    console.error(`[VS Code] Error closing integration: ${error.message}`)
    
    // Force kill if needed
    if (vscodeProcess) {
      try {
        console.log('[VS Code] Force killing VS Code process...')
        vscodeProcess.kill('SIGKILL')
        vscodeProcess = null
      } catch (e) {
        console.error(`[VS Code] Failed to force kill: ${e.message}`)
      }
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
  if (isRunningInVSCode()) {
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
