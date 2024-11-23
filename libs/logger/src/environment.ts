// src/environment.ts
export const getEnvironment = () => {
  // Check for Node.js environment more safely
  const isNode = (() => {
    try {
      return typeof globalThis.process !== 'undefined' && !!globalThis.process?.versions?.node
    } catch {
      return false
    }
  })()

  // Check for browser environment
  const isBrowser = (() => {
    try {
      return typeof window !== 'undefined'
    } catch {
      return false
    }
  })()

  // Check for development mode across different environments
  const isDev = (() => {
    try {
      // For Nuxt specific environment
      if (typeof globalThis.useRuntimeConfig === 'function') {
        const config = globalThis.useRuntimeConfig()
        return config.public.nodeEnv === 'development'
      }

      // Fallback checks
      return Boolean(
        import.meta?.env?.DEV ||
          import.meta?.env?.MODE === 'development' ||
            (typeof process !== 'undefined' && process.env.NODE_ENV === 'development'),
      )
    } catch {
      return false
    }
  })()

  return {
    isNode,
    isBrowser,
    isDev,
  }
}
