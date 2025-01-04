// composables/useLogger.ts
import type { Service, DomainsForService } from '@ib/logger'

export function useLogger(domain: DomainsForService<Service.ADMIN>) {
  const nuxtApp = useNuxtApp()

  // Ensure logger exists
  if (!nuxtApp.$logger) {
    console.warn('Logger not initialized')
    // Return a dummy logger to prevent errors
    return {
      error: console.error,
      warn: console.warn,
      info: console.info,
      setDomain: () => {},
      handleResponse: async <T>(operation: () => Promise<T>) => operation(),
    }
  }

  // Set domain if provided
  if (domain) {
    nuxtApp.$logger.setDomain(domain)
  }

  return {
    error: (msg: string, meta?: any) => nuxtApp.$logger.error(msg, meta),
    warn: (msg: string, meta?: any) => nuxtApp.$logger.warn(msg, meta),
    info: (msg: string, meta?: any) => nuxtApp.$logger.info(msg, meta),
    setDomain: (newDomain: ServiceToDomain[Service]) => nuxtApp.$logger.setDomain(newDomain),
    handleResponse: <T>(
      operation: () => Promise<T>,
      operationDomain: ServiceToDomain[Service],
      options = {},
    ) => {
      nuxtApp.$logger.setDomain(operationDomain)
      return nuxtApp.$logger.handleResponse(operation, options)
    },
  }
}
