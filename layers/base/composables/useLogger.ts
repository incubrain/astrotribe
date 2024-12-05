// composables/useLogger.ts
import type { Service, ServiceToDomain } from '@ib/logger'

export function useLogger(domain: ServiceToDomain[Service]) {
  const { $logger } = useNuxtApp()

  // Set domain if provided
  $logger.setDomain(domain)

  return {
    error: (msg: string, meta?: any) => $logger.error(msg, meta),
    warn: (msg: string, meta?: any) => $logger.warn(msg, meta),
    info: (msg: string, meta?: any) => $logger.info(msg, meta),
    setDomain: (newDomain: ServiceToDomain[Service]) => $logger.setDomain(newDomain),
    handleResponse: <T>(
      operation: () => Promise<T>,
      operationDomain: ServiceToDomain[Service],
      options = {},
    ) => {
      $logger.setDomain(operationDomain)
      return $logger.handleResponse(operation, options)
    },
  }
}
