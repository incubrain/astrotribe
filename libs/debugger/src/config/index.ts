import type { DebuggerConfig, Route } from '../types'
import testRoutes from './routes.json'
import { getMcpServerUrl } from '../vscode_integration'

/**
 * Load configuration from environment variables or use defaults
 * @returns {DebuggerConfig} Configuration object
 */
export function loadConfig(routes?: Route[]): DebuggerConfig {
  // Process command line arguments first
  const args = process.argv.slice(2)
  const useVsCodeArg = args.find(arg => arg.startsWith('--use-vscode='))
  const useInsidersArg = args.find(arg => arg.startsWith('--use-insiders='))
  const mcpServerUrlArg = args.find(arg => arg.startsWith('--mcp-server-url='))
  
  // Set environment variables based on command line arguments
  if (useVsCodeArg) {
    const useVsCode = useVsCodeArg.split('=')[1] === 'true'
    process.env.USE_VSCODE_INTEGRATION = useVsCode ? 'true' : 'false'
    console.log(`Setting USE_VSCODE_INTEGRATION=${useVsCode} from command line arg`)
  }
  
  if (useInsidersArg) {
    const useInsiders = useInsidersArg.split('=')[1] === 'true'
    process.env.USE_VSCODE_INSIDERS = useInsiders ? 'true' : 'false'
    console.log(`Setting USE_VSCODE_INSIDERS=${useInsiders} from command line arg`)
  }
  
  if (mcpServerUrlArg) {
    process.env.MCP_SERVER_URL = mcpServerUrlArg.split('=')[1]
    console.log(`Setting MCP_SERVER_URL=${process.env.MCP_SERVER_URL} from command line arg`)
  }
  
  // Check if we're running inside VS Code
  const isVSCodeRunning = process.env.VSCODE_PID !== undefined || 
                         process.env.VSCODE_CWD !== undefined || 
                         process.env.VSCODE_RUNNING === 'true'
  
  if (isVSCodeRunning) {
    console.log('Detected running inside VS Code')
  }
  
  // Determine if we should use VS Code integration
  const useVsCodeIntegration = isVSCodeRunning || process.env.USE_VSCODE_INTEGRATION === 'true'
  
  // Determine if we should use VS Code Insiders
  const useInsiders = process.env.USE_VSCODE_INSIDERS !== 'false'
  
  // Set up initial MCP server URL
  let mcpServerUrl = process.env.MCP_SERVER_URL || 'http://localhost:9222/mcp'
  
  // Create config object
  const config: DebuggerConfig = {
    authUrl: process.env.AUTH_URL || 'http://localhost:3009',
    appUrl: process.env.APP_URL || 'http://localhost:3000',
    outputPath: process.env.OUTPUT_PATH || './output/bugfixing.md',
    disableSimulation: process.env.DISABLE_SIMULATION === 'true',
    mcpServerUrl,
    vscodeIntegration: {
      enabled: useVsCodeIntegration, // Use the value we parsed earlier
      useInsiders,
      extensionId: process.env.VSCODE_EXTENSION_ID || 'ms-playwright.playwright-mcp'
    },
    credentials: {
      email: process.env.TEST_EMAIL || 'basic@testing.com',
      password: process.env.TEST_PASSWORD || 'BasicTest123$',
      role: process.env.TEST_ROLE || 'user',
      plan: process.env.TEST_PLAN || 'basic',
    },
    pages: routes ? routes : (testRoutes as Route[]),
  }
  
  // Log relevant configuration settings
  console.log('Configuration summary:')
  console.log(`- VS Code Integration: ${config.vscodeIntegration.enabled ? 'Enabled' : 'Disabled'}`)
  if (config.vscodeIntegration.enabled) {
    console.log(`- Using VS Code ${config.vscodeIntegration.useInsiders ? 'Insiders' : 'Regular'}`)
  }
  console.log(`- MCP Server URL: ${config.mcpServerUrl}`)
  console.log(`- Simulation mode: ${config.disableSimulation ? 'Disabled' : 'Enabled as fallback'}`)
  console.log(`- Application URL: ${config.appUrl}`)
  console.log(`- Authentication URL: ${config.authUrl}`)
  console.log(`- Output path: ${config.outputPath}`)
  
  // Update MCP server URL based on VS Code integration
  if (config.vscodeIntegration.enabled) {
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
