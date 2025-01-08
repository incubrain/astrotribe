// environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL?: string
      SERVICE_NAME?: string
    }
  }
}

export interface Environment {
  isDev: boolean
  databaseUrl: string
  serviceName: string
}

export {}

// environment.ts
import type { Environment } from './environment.d.js'

export const getEnvironment = (): Environment => {
  // Simplified environment detection - server-side only
  if (typeof process === 'undefined' || !process.versions?.node) {
    throw new Error('This logger can only be used in Node.js environments')
  }

  return {
    isDev: process.env.NODE_ENV === 'development',
    databaseUrl: process.env.DATABASE_URL ?? '',
    serviceName: process.env.SERVICE_NAME ?? 'api-gateway',
  }
}
