import type { SupabaseClient } from '@supabase/supabase-js'
import type { RuntimeConfig } from '@nuxt/schema'

export interface LibConfig {
  runtimeConfig: RuntimeConfig
  supabase: SupabaseClient
  useRequestHeaders: any
  useCookie: any
}

let libConfig: LibConfig | null = null

export function setLibConfig(config: LibConfig): void {
  libConfig = config
}

export function getLibConfig(): LibConfig {
  if (!libConfig) {
    throw new Error('Library configuration has not been set. Please call setLibConfig first.')
  }
  return libConfig
}
