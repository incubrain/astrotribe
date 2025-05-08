// src/index.ts
/**
 * Main Entry Point for Playwright MCP Debugger
 *
 * This module provides the main entry point for the debugger,
 * orchestrating the navigation, interaction, and logging.
 * Now with VS Code Insiders integration.
 */

import { loadConfig } from './config'
import { ensureMcpServerConfigured } from './utils/server-check'
import * as mcp from './mcp'
import * as navigator from './navigator'
import * as logger from './logger'
import * as reporter from './reporter'
import * as interactor from './interactor'
import { showNotification } from './vscode-integration'

/**
 * Run modes for the debugger
 */
type RunMode = 'simple' | 'interactive'

/**
 * Main function
 */
async function main() {
  console.log('[Debugger] Starting Playwright MCP Debugger with VS Code integration')
  const config = loadConfig()

  // Check if the VS Code MCP server is configured
  const isServerConfigured = await ensureMcpServerConfigured(config)

  if (!isServerConfigured && config.disableSimulation) {
    const errorMsg = 'Exiting because MCP server is not configured and simulation is disabled'
    console.error(errorMsg)
    showNotification(errorMsg, true)
    process.exit(1)
  }

  if (!isServerConfigured && !config.disableSimulation) {
    const warningMsg = 'Running with simulated responses because MCP server is not properly configured'
    console.warn(`⚠️ ${warningMsg}`)
    showNotification(warningMsg, true)
  }
  
  // Log if we're using VS Code integration
  if (config.vscodeIntegration?.enabled) {
    console.log(`[Debugger] Using VS Code ${config.vscodeIntegration.useInsiders ? 'Insiders' : ''} integration`)
    showNotification(`Debugger running with VS Code ${config.vscodeIntegration.useInsiders ? 'Insiders' : ''} integration`)
  }

  // Parse command line arguments
  const args = process.argv.slice(2)
  const useVsCode = args.some(arg => arg === '--use-vscode=true') || 
    process.env.USE_VSCODE_INTEGRATION === 'true'

  // Set this in the environment for other modules to use
  process.env.USE_VSCODE_INTEGRATION = useVsCode ? 'true' : 'false'
  
  const modeArg = args.find((arg) => arg.startsWith('--mode='))
  const mode = modeArg ? (modeArg.split('=')[1] as RunMode) : 'simple'

  console.log(`[Debugger] Running in ${mode} mode`)

  // Initialize the report
  await reporter.initReport(config)

  try {
    // Initialize MCP session
    await mcp.initSession(config)

    // Login to the application
    const loginSuccess = await navigator.login(config)

    if (!loginSuccess) {
      console.error('[Debugger] Login failed, aborting')
      await mcp.endSession(config)
      return
    }

    // Add login section to report
    await reporter.addReportSection('Login', 'Successfully logged in to the application.', config)

    // Process each route
    for (const route of config.pages) {
      console.log(`[Debugger] Processing route: ${route.path}`)

      // Navigate to the route
      await navigator.navigateToRoute(route, config)

      // Take a screenshot and interact with the page
      if (mode === 'interactive') {
        await interactor.interactWithPage(route, config)
      }

      // Capture console logs
      const logs = await logger.captureConsoleLogs(route, config)

      // Add logs to the report
      await reporter.addRouteLogsToReport(logs, route, config)

      // Wait between routes
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    // Finalize the report
    await reporter.finalizeReport(config)

    // End the MCP session
    await mcp.endSession(config)

    const completionMsg = `Debugger run completed. Report saved to ${config.outputPath}`
    console.log(`[Debugger] ${completionMsg}`)
    showNotification(completionMsg)
  } catch (error: any) {
    const errorMsg = `Error in debugger run: ${error.message}`
    console.error(`[Debugger] ${errorMsg}`)
    showNotification(errorMsg, true)

    // Try to end the session even if there was an error
    try {
      await mcp.endSession(config)
    } catch (e) {
      // Ignore errors when ending the session
    }
  }
}

// Run the main function
main().catch((error) => {
  const errorMsg = `Unhandled error: ${error.message || error}`
  console.error(`[Debugger] ${errorMsg}`)
  showNotification(errorMsg, true)
  process.exit(1)
})
