// First in the types file (index.d.ts)
import type { Consola } from 'consola'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BaseLogger } from './src/logger'
import type { LogMetadata } from './src/error-interface'
import type { Service, ServiceToDomain } from './src/enums-domains'

export * from './src/environment.d'
export * from './src/error-interface'
export * from './src/config'
export * from './src/enums-domains'
export * from './types/nuxt.d'

// Generic interface for the logger
export interface CentralizedLogger<S extends Service = Service> extends BaseLogger {
  setServiceName(service: S): void
  setDomain(domain: ServiceToDomain[S]): void
  error(message: string, metadata?: any): void
  warn(message: string, metadata?: any): void
  info(message: string, metadata?: any): void
  verbose(message: string, metadata?: any): void
  debug(message: string, metadata?: any): void
  silly(message: string, metadata?: any): void
}

// Updated factory functions with generics
export function createCentralizedLogger<S extends Service>(): CentralizedLogger<S>
export function useLogger<S extends Service>(tag?: string): CentralizedLogger<S>

// Extended metadata type
export interface LoggerMetadata extends LogMetadata {
  timestamp: string
  context?: string
  error?: Error | unknown
  service: Service
  domain?: string
  [key: string]: any
}

// Response handler with service generic
export function handleResponse<T, S extends Service>(
  logger: CentralizedLogger<S>,
  operation: () => Promise<T>,
  context: string,
  options?: {
    successMessage?: string
    errorMessage?: string
  },
): Promise<T>
