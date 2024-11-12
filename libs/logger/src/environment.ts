// src/environment.ts
export const getEnvironment = () => {
  // Check for Node.js environment
  const isNode =
    typeof process !== 'undefined' && process.versions != null && process.versions.node != null

  // Check for browser environment
  const isBrowser = typeof window !== 'undefined'

  // Check for development mode across different environments
  const isDev =
    (process?.env?.NODE_ENV === 'development' ||
      process?.env?.MODE === 'development' ||
      import.meta?.env?.DEV ||
      import.meta?.env?.MODE === 'development') ??
    false

  return {
    isNode,
    isBrowser,
    isDev,
  }
}
