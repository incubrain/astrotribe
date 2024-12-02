import type { Consola } from 'consola'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { BaseLogger } from './src/logger'
import type { LogMetadata } from './src/error-interface'

export * from './src/environment.d'
export * from './src/error-interface'

export interface CentralizedLogger extends BaseLogger {
  setMetadata(metadata: Partial<LogMetadata>): void
  getSupabaseClient(): SupabaseClient | null
}

// Function signatures
export function useLogger(tag?: string): Consola
export function useLoggerAsync(tag?: string): Promise<Consola>
export function createCentralizedLogger(serviceName: string): CentralizedLogger
export function createLoggerAsync(tag?: string): Promise<CentralizedLogger>
