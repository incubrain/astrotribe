// First in the types file (index.d.ts)
import type { Consola } from 'consola'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { LogMetadata } from './error-interface.js'
import type { Service, ServiceToDomain } from './enums-domains.js'

export * from './environment'
export * from './error-interface'
export * from './config'
export * from './enums-domains'
export * from './types/nuxt'

// Generic interface for the logger
export class CentralizedLogger<S extends Service = Service> {
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
