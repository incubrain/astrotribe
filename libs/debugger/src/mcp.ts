/**
 * MCP Module for Playwright MCP Debugger
 *
 * This module provides functions for interacting with the Playwright MCP server,
 * whether it's running in VS Code or as a standalone service.
 * Includes improved error handling and diagnostics.
 */

import fetch from 'node-fetch'
import type { ChildProcess } from 'child_process'
import { spawn } from 'child_process'
import type { DebuggerConfig } from './types'
import { 
  initVsCodeIntegration, 
  closeVsCodeIntegration, 
  testMcpServerConnection,
  isRunningInVSCode
} from './vscode_integration'

// Store the server process
let serverProcess: ChildProcess | null = null
const pendingRequests: Map<string, { resolve: Function; reject: Function }> = new Map()
let nextRequestId = 1
let lastSnapshot: any = null
let sessionId: string | null = null
let serverOutput = '' // Store server output for diagnostics

/**
 * Initialize a session with the Playwright MCP server
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<boolean>} Whether initialization was successful
 */
export async function initSession(config: DebuggerConfig): Promise<boolean> {
  console.log('[MCP] Initializing MCP session...')

  // Check for command-line arguments
  const useVsCodeArg = process.argv.find(arg => arg.startsWith('--use-vscode='));
  if (useVsCodeArg) {
    const useVsCode = useVsCodeArg.split('=')[1] === 'true';
    config.vscodeIntegration.enabled = useVsCode;
    console.log(`[MCP] Setting VS Code integration to ${useVsCode} based on command line argument`);
  }

  if (serverProcess) {
    console.log('[MCP] Server process already running')
    return true
  }

  try {
    // Check if VS Code integration is enabled
    if (config.vscodeIntegration?.enabled) {
      console.log('[MCP] VS Code integration enabled, initializing VS Code Playwright MCP')
      
      // Initialize VS Code integration
      const vsCodeInitialized = await initVsCodeIntegration(config)
      
      if (!vsCodeInitialized) {
        console.error('[MCP] VS Code integration initialization failed')
        
        if (config.disableSimulation) {
          throw new Error('Failed to initialize VS Code integration and simulation is disabled')
        } else {
          console.warn('[MCP] Falling back to simulation mode')
          return true
        }
      }

      // Give VS Code a moment to start the MCP server
      console.log('[MCP] Waiting for VS Code MCP server to initialize...')
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Test connection to MCP server
      console.log(`[MCP] Testing connection to MCP server at ${config.mcpServerUrl}`)
      const isConnected = await testMcpServerConnection(config.mcpServerUrl)
      
      if (!isConnected) {
        console.error(`[MCP] Could not connect to MCP server at ${config.mcpServerUrl}`)
        
        if (config.disableSimulation) {
          throw new Error('Failed to connect to MCP server and simulation is disabled')
        } else {
          console.warn('[MCP] Falling back to simulation mode')
          return true
        }
      }
      
      // Start a session with the VS Code MCP server
      try {
        sessionId = await startMcpSession(config)
        console.log(`[MCP] Started session with VS Code MCP server: ${sessionId}`)
        return true
      } catch (error) {
        console.error('[MCP] Failed to start session with VS Code MCP server:', error)
        if (!config.disableSimulation) {
          console.log('[MCP] Falling back to simulation mode')
          return true
        }
        return false
      }
    }

    // If we get here and don't have a direct integration, try to start the server directly
    console.log('[MCP] VS Code integration not enabled, trying direct server launch')
    
    // Define command and args for a standalone server with more detailed options
    const command = 'npx'
    const args = [
      '@playwright/mcp@latest',
      '--browser', 'chrome',      // Specify the browser explicitly
      '--headless=false',        // Non-headless mode for visibility
      '--port', '4444'           // Specific port to avoid conflicts
    ]
    
    console.log(`[MCP] Spawning server with command: ${command} ${args.join(' ')}`)

    // Reset the server output buffer
    serverOutput = ''

    // Spawn the server process with better error handling
    try {
      serverProcess = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: process.env
      })
      
      if (!serverProcess || !serverProcess.pid) {
        throw new Error('Failed to start MCP server process')
      }
      
      console.log(`[MCP] Server process started with PID: ${serverProcess.pid}`)
    } catch (spawnError) {
      console.error(`[MCP] Error spawning server process: ${spawnError.message}`)
      
      if (config.disableSimulation) {
        throw spawnError
      } else {
        console.warn('[MCP] Falling back to simulation mode due to spawn error')
        return true
      }
    }

    // Set up event handlers with improved diagnostics
    serverProcess.stdout!.on('data', (data) => {
      const output = data.toString().trim()
      if (output) {
        serverOutput += output + '\n'
        console.log(`[MCP Server Output] ${output}`)
        handleServerResponse(Buffer.from(output))
      }
    })

    serverProcess.stderr!.on('data', (data) => {
      const error = data.toString().trim()
      if (error) {
        serverOutput += `ERROR: ${error}\n`
        console.error(`[MCP Server Error] ${error}`)
      }
    })

    serverProcess.on('close', (code) => {
      console.log(`[MCP] Server process exited with code ${code}`)
      
      if (code !== 0) {
        console.error('[MCP] Server process output before exit:')
        console.error(serverOutput)
      }
      
      serverProcess = null
    })

    serverProcess.on('error', (error) => {
      console.error(`[MCP] Server process error: ${error.message}`)
      serverOutput += `PROCESS ERROR: ${error.message}\n`
    })

    // Wait for the server to initialize with better detection
    console.log('[MCP] Waiting for standalone MCP server to initialize...')
    
    // Wait for startup indicators with timeout
    const startupSuccess = await waitForServerReady(10000)
    
    if (!startupSuccess) {
      console.error('[MCP] Timed out waiting for server initialization')
      console.error('[MCP] Server output so far:')
      console.error(serverOutput)
      
      if (config.disableSimulation) {
        throw new Error('Server initialization timeout and simulation is disabled')
      } else {
        console.warn('[MCP] Falling back to simulation mode due to server timeout')
        return true
      }
    }

    console.log('[MCP] Server process started successfully')
    return true
  } catch (error: any) {
    console.error(`[MCP] Error initializing session: ${error.message}`)
    console.error(`[MCP] Error stack: ${error.stack || 'No stack trace available'}`)

    if (!config.disableSimulation) {
      console.log('[MCP] Falling back to simulation mode')
      return true
    }
    return false
  }
}

/**
 * Wait for the MCP server to be ready
 * @param {number} timeout Timeout in milliseconds
 * @returns {Promise<boolean>} Whether the server is ready
 */
async function waitForServerReady(timeout: number): Promise<boolean> {
  const startTime = Date.now()
  
  while (Date.now() - startTime < timeout) {
    // Check for startup indicators in server output
    if (serverOutput.includes('Listening on') || 
        serverOutput.includes('Server started') || 
        serverOutput.includes('ready at')) {
      return true
    }
    
    // Try to connect to the server
    try {
      const response = await fetch('http://localhost:4444/ping', {
        method: 'GET',
        timeout: 1000
      })
      
      if (response.ok) {
        return true
      }
    } catch (error) {
      // Ignore connection errors during startup
    }
    
    // Wait a bit before trying again
    await new Promise(resolve => setTimeout(resolve, 500))
  }
  
  return false
}

/**
 * Start a session with the MCP server
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<string>} Session ID
 */
async function startMcpSession(config: DebuggerConfig): Promise<string> {
  try {
    console.log(`[MCP] Starting session with MCP server at ${config.mcpServerUrl}`)
    
    const response = await fetch(config.mcpServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'session-init',
        method: 'initialize',
        params: {}
      })
    })

    if (!response.ok) {
      throw new Error(`Failed to initialize MCP session: ${response.statusText} (${response.status})`)
    }

    const data = await response.json()
    const sid = data.result?.sessionId || 'default-session'
    console.log(`[MCP] Session started with ID: ${sid}`)
    return sid
  } catch (error: any) {
    console.error(`[MCP] Error starting MCP session: ${error.message}`)
    throw error
  }
}

/**
 * Handle response data from the server
 * @param {Buffer} data Response data
 */
function handleServerResponse(data: Buffer) {
  try {
    const responseText = data.toString().trim()
    if (!responseText) return

    const responseLines = responseText.split('\n')

    for (const line of responseLines) {
      if (!line.trim()) continue

      try {
        // Try to parse as JSON
        const response = JSON.parse(line)

        // If this is a snapshot response, store it for later reference
        if (response.content && response.content[0]?.text?.includes('Page Snapshot')) {
          const snapText = response.content[0].text
          const yamlStart = snapText.indexOf('```yaml')
          const yamlEnd = snapText.lastIndexOf('```')

          if (yamlStart > 0 && yamlEnd > yamlStart) {
            // Extract and store the YAML snapshot
            const yaml = snapText.substring(yamlStart + 8, yamlEnd).trim()
            lastSnapshot = yaml
            console.log('[MCP] Stored new page snapshot')
          }
        }

        // Handle matching request ID
        if (response.id && pendingRequests.has(response.id)) {
          const { resolve } = pendingRequests.get(response.id)!
          pendingRequests.delete(response.id)
          resolve(response)
        } else if (response.content) {
          // If no matching ID but has content, log it
          console.log(`[MCP] Received server response with no matching request ID: ${JSON.stringify(response)}`)
        }
      } catch (parseError) {
        // Not a JSON response, might be informational output
        // Only log parsing errors for lines that look like they should be JSON
        if (line.includes('{') || line.includes('}')) {
          console.error(`[MCP] Error parsing response line: ${line}`, parseError)
        }
      }
    }
  } catch (error: any) {
    console.error(`[MCP] Error handling server response: ${error.message}`)
  }
}

/**
 * Call an MCP function using HTTP for VS Code integration or stdio for direct process
 * @param {string} functionName Name of the function to call
 * @param {any} params Parameters for the function
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<any>} Function result
 */
export async function callMcp(
  functionName: string,
  params: any,
  config: DebuggerConfig
): Promise<any> {
  console.log(`[MCP] Calling ${functionName} with params:`, JSON.stringify(params, null, 2))

  // Ensure we have a session
  if (!serverProcess && !sessionId) {
    const initialized = await initSession(config)
    if (!initialized && config.disableSimulation) {
      throw new Error('Failed to initialize MCP session and simulation is disabled')
    }
  }

  // If we're in simulation mode or failed to initialize
  if (!serverProcess && !sessionId && !config.disableSimulation) {
    console.log(`[MCP] Using simulated response for ${functionName}`)
    return simulateResponse(functionName, params)
  }

  try {
    // If we have a VS Code integration with a sessionId, use HTTP
    if (sessionId && config.vscodeIntegration?.enabled) {
      return await callMcpViaHttp(functionName, params, config)
    }
    
    // Otherwise use direct process communication
    return await callMcpViaProcess(functionName, params)
  } catch (error: any) {
    console.error(`[MCP] Error calling ${functionName}:`, error.message)
    console.error(`[MCP] Error stack:`, error.stack || 'No stack trace available')

    // Fall back to simulation if enabled
    if (!config.disableSimulation) {
      console.log(`[MCP] Using simulated response for ${functionName} after error`)
      return simulateResponse(functionName, params)
    } else {
      throw error // Re-throw if simulation is disabled
    }
  }
}

/**
 * Call an MCP function via HTTP (for VS Code integration)
 * @param {string} functionName Name of the function to call
 * @param {any} params Parameters for the function
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<any>} Function result
 */
async function callMcpViaHttp(
  functionName: string,
  params: any,
  config: DebuggerConfig
): Promise<any> {
  // Generate a unique request ID
  const requestId = `req-${nextRequestId++}`

  try {
    console.log(`[MCP] Making HTTP request to ${config.mcpServerUrl} for function ${functionName}`)
    
    const requestBody = {
      jsonrpc: '2.0',
      id: requestId,
      method: functionName,
      params: {
        sessionId,
        ...params
      }
    }
    
    console.log(`[MCP] Request body: ${JSON.stringify(requestBody)}`)
    
    const response = await fetch(config.mcpServerUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      throw new Error(`HTTP call failed: ${response.statusText} (${response.status})`)
    }

    const data = await response.json()
    console.log(`[MCP] ${functionName} call successful via HTTP`)
    return data
  } catch (error: any) {
    console.error(`[MCP] HTTP call error for ${functionName}:`, error.message)
    throw error
  }
}

/**
 * Call an MCP function via direct process communication
 * @param {string} functionName Name of the function to call
 * @param {any} params Parameters for the function
 * @returns {Promise<any>} Function result
 */
async function callMcpViaProcess(functionName: string, params: any): Promise<any> {
  if (!serverProcess) {
    throw new Error('Server process not available')
  }

  // Generate a unique request ID
  const requestId = `req-${nextRequestId++}`

  // Create the request object
  const request = {
    id: requestId,
    name: functionName,
    args: params,
  }

  // Send the request to the server
  const requestStr = JSON.stringify(request) + '\n'
  
  try {
    if (!serverProcess.stdin?.writable) {
      throw new Error('Server process stdin is not writable')
    }
    
    serverProcess.stdin.write(requestStr)
    console.log(`[MCP] Sent request: ${requestStr.trim()}`)
  } catch (writeError) {
    console.error(`[MCP] Error writing to server process:`, writeError)
    throw writeError
  }

  // Create a promise that will be resolved when we get a response
  const responsePromise = new Promise((resolve, reject) => {
    // Store the callbacks in the pending requests map
    pendingRequests.set(requestId, { resolve, reject })

    // Set a timeout to avoid hanging indefinitely
    setTimeout(() => {
      if (pendingRequests.has(requestId)) {
        pendingRequests.delete(requestId)
        
        // Log current server output for diagnostic purposes
        console.error(`[MCP] Request ${requestId} timed out after 30 seconds`)
        console.error(`[MCP] Server output so far:`)
        console.error(serverOutput)
        
        reject(new Error(`Request ${requestId} timed out after 30 seconds`))
      }
    }, 30000)
  })

  // Wait for the response
  const response = await responsePromise
  console.log(`[MCP] ${functionName} call successful via process`)
  return response
}

/**
 * End the MCP session
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<boolean>} Whether the session was ended successfully
 */
export async function endSession(config: DebuggerConfig): Promise<boolean> {
  console.log('[MCP] Ending MCP session...')

  try {
    // Try to close the browser gracefully regardless of connection type
    try {
      await callMcp('browser_close', {}, config)
      console.log('[MCP] Browser closed successfully')
    } catch (error) {
      console.log('[MCP] Error closing browser, continuing with shutdown:', error)
    }

    // If we have a VS Code integration, close it
    if (config.vscodeIntegration?.enabled) {
      await closeVsCodeIntegration()
      sessionId = null
    }

    // If we have a direct server process, kill it
    if (serverProcess) {
      console.log('[MCP] Shutting down standalone server process...')
      try {
        serverProcess.kill()
        console.log('[MCP] Server process killed')
      } catch (killError) {
        console.error('[MCP] Error killing server process:', killError)
      }
      serverProcess = null
    }

    pendingRequests.clear()
    console.log('[MCP] Session ended successfully')
    return true
  } catch (error: any) {
    console.error(`[MCP] Error ending session: ${error.message}`)

    // Force kill if needed
    if (serverProcess) {
      try {
        console.log('[MCP] Force killing server process with SIGKILL...')
        serverProcess.kill('SIGKILL')
      } catch (e) {
        console.error('[MCP] Error during force kill:', e)
      }
      serverProcess = null
    }

    return false
  }
}

/**
 * Get the latest snapshot refs
 * @returns {Object} References from the snapshot
 */
export function getSnapshotRefs() {
  // This would parse the YAML to extract refs
  // For now, returning a simple placeholder
  return {
    hasSnapshot: !!lastSnapshot,
    snapshot: lastSnapshot,
  }
}

/**
 * Simulate a response for a function
 * @param {string} functionName Name of the function
 * @param {any} params Parameters for the function
 * @returns {any} Simulated response
 */
function simulateResponse(functionName: string, params: any): any {
  console.log(`[MCP] Generating simulated response for ${functionName}`)
  
  // Basic simulation for common functions
  switch (functionName) {
    case 'browser_navigate':
      return {
        id: 'sim-1',
        content: [{ type: 'text', text: `Navigated to ${params.url}` }],
      }

    case 'browser_click':
      return {
        id: 'sim-2',
        content: [{ type: 'text', text: `Clicked on ${params.element || 'element'}` }],
      }

    case 'browser_type':
      return {
        id: 'sim-3',
        content: [
          { type: 'text', text: `Typed "${params.text}" into ${params.element || 'element'}` },
        ],
      }

    case 'browser_snapshot':
      return {
        id: 'sim-4',
        content: [
          {
            type: 'text',
            text: `- Page URL: ${params.url || 'http://localhost:3000'}\n- Page Title: Example Page\n- Page Snapshot\n\`\`\`yaml\nroot:\n  children:\n    - name: "Example Element"\n      role: "button"\n      ref: "btn1"\n\`\`\`\n`,
          },
        ],
      }

    case 'browser_take_screenshot':
      return {
        id: 'sim-5',
        content: [
          {
            type: 'image',
            data: 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
            mimeType: 'image/jpeg',
          },
        ],
      }

    default:
      return {
        id: 'sim-default',
        content: [
          { type: 'text', text: `Simulated ${functionName} with ${JSON.stringify(params)}` },
        ],
      }
  }
}

// Export common MCP functions with corrected function names
export function navigate(params: any, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_navigate', params, config)
}

export function click(params: any, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_click', params, config)
}

export function fill(params: any, config: DebuggerConfig): Promise<any> {
  // Convert our API to the expected browser_type format
  const formattedParams = {
    element: params.element || params.selector || 'input field',
    ref: params.ref || params.selector || '',
    text: params.text || params.value || '',
    submit: params.submit || false,
  }
  return callMcp('browser_type', formattedParams, config)
}

export function getVisibleHtml(params: any, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_snapshot', params, config)
}

export function consoleLogs(params: any, config: DebuggerConfig): Promise<any> {
  // Try to use browser_console tool if available
  try {
    return callMcp('browser_console', params, config)
  } catch (error) {
    // Fall back to simulation if the tool is not available
    return simulateResponse('consoleLogs', params)
  }
}

export function screenshot(params: any, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_take_screenshot', params, config)
}

export function close(params: any, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_close', params, config)
}

export function waitTime(time: number, config: DebuggerConfig): Promise<any> {
  return callMcp('browser_wait', { time }, config)
}

export function snapshot(config: DebuggerConfig): Promise<any> {
  return callMcp('browser_snapshot', {}, config)
}
