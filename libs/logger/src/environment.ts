// src/environment.ts
import type { Environment } from './environment.d.js'

export const getEnvironment = (): Environment => {
  // Ensure we're in a Node.js environment
  if (typeof process === 'undefined' || !process.versions?.node) {
    throw new Error('This logger can only be used in Node.js environments')
  }

  return {
    isDev: process.env.NODE_ENV === 'development',
    databaseUrl: process.env.DATABASE_URL ?? '',
    serviceName: process.env.SERVICE_NAME ?? 'api',
  }
}
