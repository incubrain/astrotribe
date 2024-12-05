// src/environment.d.ts

declare global {
  // Add Nuxt runtime config types
  interface RuntimeConfig {
    public: {
      nodeEnv?: string
      supabaseUrl?: string
      serviceName?: string
      [key: string]: any
    }
    serviceName?: string
    supabaseKey?: string
    supabaseServiceKey?: string
    [key: string]: any
  }

  // Add useRuntimeConfig function type
  type UseRuntimeConfig = () => RuntimeConfig

  interface Global {
    useRuntimeConfig?: UseRuntimeConfig
  }

  interface Window {
    __NUXT__?: {
      config?: RuntimeConfig
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      SUPABASE_URL?: string
      SUPABASE_KEY?: string
      SUPABASE_SERVICE_KEY?: string
      SERVICE_NAME?: string
    }
  }
}

export interface ImportMetaEnv {
  MODE: string
  DEV: boolean
  PROD: boolean
  SUPABASE_URL?: string
  SERVICE_NAME?: string
  [key: string]: any
}

export interface ImportMeta {
  url: string
  env: ImportMetaEnv
  server?: boolean
  client?: boolean
  readonly hot?: {
    accept: () => void
    dispose: () => void
    invalidate: () => void
    [key: string]: any
  }
}

export interface Environment {
  isNode: boolean
  isBrowser: boolean
  isDev: boolean
  supabase: {
    url: string | null
    key: string | null
    serviceKey: string | null
  }
  serviceName: string
}

export {}
