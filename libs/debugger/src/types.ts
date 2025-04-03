/**
 * Type definitions for the Playwright MCP Debugger
 */

export interface Route {
  path: string
  critical: boolean
}

/**
 * Result of a tool call
 */
export interface ToolCallResult {
  success: boolean
  result?: any
  error?: string
}

/**
 * Configuration for the debugger
 */
export interface DebuggerConfig {
  authUrl: string
  appUrl: string
  disableSimulation: boolean
  outputPath: string
  mcpServerUrl: string
  vscodeIntegration?: {
    enabled: boolean
    extensionId?: string
    useInsiders?: boolean
  }
  credentials: {
    email: string
    password: string
    role: string
    plan: string
  }
  pages: Route[]
}

/**
 * MCP Function parameters
 */
export type McpFunctionParams =
  | { url: string; browserType: string; headless: boolean } // navigate
  | { selector: string } // click
  | { selector: string; value: string } // fill
  | { time: number } // wait
  | { name: string; fullPage: boolean; savePng: boolean } // screenshot
  | Record<string, never> // close, etc.

/**
 * Test step
 */
export interface TestStep {
  description: string
  action: string
  mcpFunction: string
  params: McpFunctionParams
  result?: any
}

/**
 * Test error
 */
export interface TestError {
  route: string
  message: string
}

/**
 * Route test result
 */
export interface RouteResult {
  route: string
  success: boolean
  error?: string
  logs: LogEntry[]
  snapshots: string[]
  screenshots: string[]
  text?: string
}

/**
 * Log entry
 */
export interface LogEntry {
  type: string
  message: string
  timestamp: string
}

/**
 * Log type
 */
export enum LogType {
  ALL = 'all',
  ERROR = 'error',
  WARNING = 'warning',
  LOG = 'log',
  INFO = 'info',
  DEBUG = 'debug',
}

/**
 * Test result
 */
export interface TestResult {
  success: boolean
  message?: string
  error?: string
  apiCalls?: any[]
  steps?: TestStep[]
  startTime: string
  endTime: string
  routes: RouteResult[]
  errors: TestError[]
}
