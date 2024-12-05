// src/environment.ts
import type { Environment } from './environment.d'

// Remove the globalThis.useRuntimeConfig mock block entirely

export const getEnvironment = (): Environment => {
  const isNode = typeof process !== 'undefined' && !!process.versions?.node
  const isBrowser = typeof window !== 'undefined'

  // If running in a Node/Nuxt environment, `runtimeConfig` will be provided by the plugin
  // If this code is invoked outside Nuxt, it will just use process.env as fallback.

  return {
    isNode,
    isBrowser,
    isDev: process.env.NODE_ENV === 'development',
    supabase: {
      url: process.env.SUPABASE_URL || null,
      key: process.env.SUPABASE_KEY || null,
      serviceKey: process.env.SUPABASE_SERVICE_KEY || null,
    },
    serviceName: process.env.SERVICE_NAME ?? 'api-gateway',
  }
}
