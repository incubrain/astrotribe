// src/environment.ts
import type { Environment } from './environment.d.js'

export const getEnvironment = (): Environment => {
  // More robust environment detection
  const isNode = typeof process !== 'undefined' && !!process.versions?.node
  const isBrowser = typeof window !== 'undefined'

  // Check for Nuxt environment
  const isNuxt =
    typeof process !== 'undefined' &&
    (process.env.NUXT_APP === 'true' ||
      (process.env.NODE_ENV === 'development' && process.env.__NUXT_PATHS__))

  // When running in Nuxt SSR, we're technically in Node but should treat it differently
  const effectivelyNode = isNode && !isNuxt

  // Get config from various possible sources
  let config: Record<string, any> = {}

  if (isBrowser && window.__NUXT__?.config) {
    // Browser Nuxt context
    config = window.__NUXT__.config
    throw new Error(
      'This logger is not intended for use in the browser, pass client errors to the server then log them with this logger',
    )
  } else if (isNode) {
    // Node/SSR context
    config = process.env
  }

  return {
    isNode: effectivelyNode,
    isBrowser,
    isDev: process.env.NODE_ENV === 'development',
    databaseUrl: config.DATABASE_URL,
    serviceName: config.SERVICE_NAME ?? 'api-gateway',
  }
}
