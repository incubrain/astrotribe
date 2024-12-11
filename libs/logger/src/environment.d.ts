// src/environment.d.ts
declare global {
  interface Window {
    __NUXT__?: {
      config?: {
        SUPABASE_URL?: string
        SUPABASE_KEY?: string
        SUPABASE_SERVICE_KEY?: string
        SERVICE_NAME?: string
        [key: string]: any
      }
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      NUXT_APP?: string
      __NUXT_PATHS__?: string
      SUPABASE_URL?: string
      SUPABASE_KEY?: string
      SUPABASE_SERVICE_KEY?: string
      SERVICE_NAME?: string
    }
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
