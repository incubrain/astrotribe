/**
 * Server Check Module for Playwright MCP Debugger
 *
 * This module checks if the Playwright MCP server is configured in VS Code
 * and provides functionality to ensure it's properly installed.
 */

import { execSync } from 'child_process'
import { existsSync, readFileSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import fetch from 'node-fetch'
import type { DebuggerConfig } from '../types'

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
 * Test if an MCP server is running at the given URL
 * @param {string} url MCP server URL
 * @returns {Promise<boolean>} Whether the server is running
 */
async function testMcpServerConnection(url: string): Promise<boolean> {
  try {
    // Try a simple request to test connection
    const pingUrl = url.endsWith('/') ? `${url}ping` : `${url}/ping`;
    
    console.log(`Testing MCP server connection to: ${pingUrl}`);
    
    const response = await fetch(pingUrl, {
      method: 'GET',
      timeout: 2000 // 2 second timeout
    });
    
    if (response.ok) {
      return true;
    }
    
    // If ping endpoint doesn't exist, try a dummy request
    const jsonRpcResponse = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'connection-test',
        method: 'ping',
        params: {}
      }),
      timeout: 3000
    });
    
    return jsonRpcResponse.status !== 404; // If not 404, assume server is running
  } catch (error) {
    console.error(`Failed to connect to MCP server at ${url}: ${error.message}`);
    return false;
  }
}

/**
 * Check if VS Code Insiders has the Playwright MCP extension installed
 * @returns {Promise<boolean>} Whether the MCP server is configured
 */
export async function isMcpServerConfigured(config: DebuggerConfig): Promise<boolean> {
  try {
    // First, check if we're running inside VS Code
    if (isRunningInVSCode()) {
      console.log('Running inside VS Code, checking for Playwright MCP...')
      // When running inside VS Code, we can assume MCP is available if this code is running
      return true
    }

    // If we're running externally, check VS Code Insiders extensions
    console.log('Checking if Playwright MCP is installed in VS Code...')
    
    // Determine which VS Code to use
    const useInsiders = process.env.USE_VSCODE_INSIDERS !== 'false'
    const vscodeCommand = useInsiders ? 'code-insiders' : 'code'
    
    console.log(`Using ${vscodeCommand} for VS Code integration`)
    
    // Check if VS Code is installed and accessible
    try {
      // Try to get the path to VS Code
      const vscodePathCmd = process.platform === 'win32' 
        ? `where ${vscodeCommand} 2>&1`
        : `which ${vscodeCommand} 2>&1`
        
      const vscodePath = execSync(vscodePathCmd, { encoding: 'utf8' }).trim()
      
      if (!vscodePath || vscodePath.includes('not found')) {
        console.error(`❌ ${vscodeCommand} not found in PATH`)
        console.error(`Please ensure ${vscodeCommand} is installed and in your PATH`)
      } else {
        console.log(`✅ ${vscodeCommand} found at: ${vscodePath}`)
        
        // Check for the Playwright extension
        try {
          const extensionsCmd = `${vscodeCommand} --list-extensions | grep -i playwright`
          const result = execSync(extensionsCmd, { encoding: 'utf8' })
          const isInstalled = result.trim().length > 0
          
          if (isInstalled) {
            console.log(`✅ Playwright MCP extension found in ${vscodeCommand}`)
            return true
          } else {
            console.log(`❌ Playwright MCP extension not found in ${vscodeCommand}`)
          }
        } catch (err) {
          console.log(`Could not check extensions: ${err.message}`)
          // Continue with other checks
        }
      }
    } catch (err) {
      console.error(`Error checking VS Code installation: ${err.message}`)
      // Continue with other checks
    }
    
    // Check for the VS Code settings file that might have MCP configuration
    const vsCodeDir = useInsiders ? 'Code - Insiders' : 'Code'
    
    const settingsPath = join(homedir(), '.config', vsCodeDir, 'User', 'settings.json')
    const macSettingsPath = join(homedir(), 'Library', 'Application Support', vsCodeDir, 'User', 'settings.json')
    const winSettingsPath = join(process.env.APPDATA || '', vsCodeDir, 'User', 'settings.json')
    
    const paths = [settingsPath, macSettingsPath, winSettingsPath]
    console.log('Checking for MCP configuration in VS Code settings files:')
    
    for (const path of paths) {
      if (existsSync(path)) {
        console.log(`- Checking settings file: ${path}`)
        try {
          const settings = JSON.parse(readFileSync(path, 'utf8'))
          if (settings.mcpServers?.playwright) {
            console.log(`✅ Playwright MCP configuration found in settings: ${path}`)
            return true
          }
        } catch (err) {
          console.log(`  - Error reading settings file: ${err.message}`)
          // Continue checking other paths
        }
      }
    }
    
    // As a final fallback, check if the config has a valid MCP server URL
    if (config.mcpServerUrl) {
      console.log(`Testing MCP server URL: ${config.mcpServerUrl}`)
      if (await testMcpServerConnection(config.mcpServerUrl)) {
        console.log(`✅ Successfully connected to MCP server at: ${config.mcpServerUrl}`)
        return true
      } else {
        console.log(`❌ Could not connect to MCP server at: ${config.mcpServerUrl}`)
      }
    }
    
    return false
  } catch (error) {
    console.error('Error checking MCP server configuration:', error)
    return false
  }
}

/**
 * Ensure MCP server is properly configured in VS Code
 * @param {DebuggerConfig} config Debugger configuration
 * @returns {Promise<boolean>} Whether the server is configured and available
 */
export async function ensureMcpServerConfigured(config: DebuggerConfig): Promise<boolean> {
  console.log('Ensuring Playwright MCP server is configured...')

  // Determine if we should use VS Code command-line flags
  const useVsCodeArg = process.argv.find(arg => arg.startsWith('--use-vscode='));
  if (useVsCodeArg) {
    const useVsCode = useVsCodeArg.split('=')[1] === 'true';
    console.log(`Setting USE_VSCODE_INTEGRATION to ${useVsCode} based on command line argument`);
    process.env.USE_VSCODE_INTEGRATION = useVsCode ? 'true' : 'false';
  }

  const isConfigured = await isMcpServerConfigured(config)

  if (!isConfigured) {
    // Determine which VS Code to use
    const useInsiders = process.env.USE_VSCODE_INSIDERS !== 'false';
    const vscodeCommand = useInsiders ? 'code-insiders' : 'code';
    
    console.error(`⛔ Playwright MCP server is not configured in ${vscodeCommand}!`)
    console.error(`Please install the Playwright MCP server in ${vscodeCommand}.`)
    console.error('You can try the following solutions:')
    console.error(`1. Run: ${vscodeCommand} --install-extension ms-playwright.playwright-mcp`)
    console.error(`2. Or run: npm run install:vscode`)

    if (isRunningInVSCode()) {
      console.error(
        "3. You can install it from the VS Code extensions panel by searching for 'Playwright MCP'."
      )
    }
    
    console.error('\nIf the problem persists, try these troubleshooting steps:')
    console.error(`1. Ensure ${vscodeCommand} is installed and in your PATH`)
    console.error(`2. Try using regular VS Code by setting USE_VSCODE_INSIDERS=false in your environment`)
    console.error(`3. Try using a direct MCP server URL with the MCP_SERVER_URL environment variable`)

    if (!config.disableSimulation) {
      console.warn('⚠️ Running with simulated responses because MCP server is not properly configured')
      return true
    }

    return false
  }

  console.log('✅ Playwright MCP server is configured')
  return true
}