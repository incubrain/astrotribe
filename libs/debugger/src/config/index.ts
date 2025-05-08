import type { DebuggerConfig, Route } from '../types'
import { getMcpServerUrl } from '../vscode-integration'
import testRoutes from './routes.json'

/**
 * Load configuration from environment variables or use defaults
 * @returns {DebuggerConfig} Configuration object
 */
export function loadConfig(routes?: Route[]): DebuggerConfig {
  // Check if we're running inside VS Code
  const isVSCodeRunning = process.env.VSCODE_RUNNING === 'true'

  // Determine if we should use VS Code Insiders
  const useInsiders = process.env.USE_VSCODE_INSIDERS !== 'false'

  // Set up initial MCP server URL
  const mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:9222/mcp'

  // Create config object
  const config: DebuggerConfig = {
    authUrl: process.env.AUTH_URL || 'http://localhost:3009',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    outputPath: process.env.OUTPUT_PATH || './output/bugfixing.md',
    disableSimulation: process.env.DISABLE_SIMULATION === 'true',
    mcpServerUrl,
    vscodeIntegration: {
      enabled: isVSCodeRunning || process.env.USE_VSCODE_INTEGRATION === 'true',
      useInsiders,
      extensionId: process.env.VSCODE_EXTENSION_ID || 'ms-playwright.playwright-mcp',
    },
    credentials: {
      email: process.env.TEST_EMAIL || 'basic@testing.com',
      password: process.env.TEST_PASSWORD || 'BasicTest123$',
      role: process.env.TEST_ROLE || 'user',
      plan: process.env.TEST_PLAN || 'basic',
    },
    pages: routes ? routes : (testRoutes as Route[]),
  }

  // Update MCP server URL based on VS Code integration
  if (config.vscodeIntegration && config.vscodeIntegration.enabled) {
    config.mcpServerUrl = getMcpServerUrl(config)
  }

  return config
}

/**
 * Load routes from the routes.json file or use defaults
 * @returns {Route[]} Array of routes
 */
export function loadRoutes(definedRoutes?: Route[]): Route[] {
  return definedRoutes ? definedRoutes : (testRoutes as Route[])
}

/**
 * Convert a path to a readable name
 * @param {string} path URL path
 * @returns {string} Readable name
 */
function pathToName(path: string): string {
  // Remove leading slash and split by slashes
  const parts = path.replace(/^\//, '').split('/')

  // If empty (root path), return "Home"
  if (parts[0] === '') return 'Home'

  // Convert to title case and join with spaces
  return parts
    .map((part) => {
      // Convert kebab-case to Title Case
      return part
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    })
    .join(' - ')
}
