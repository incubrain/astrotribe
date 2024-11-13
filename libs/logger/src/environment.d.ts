// src/environment.d.ts

declare global {
  // Add Nuxt runtime config types
  interface RuntimeConfig {
    public: {
      nodeEnv?: string
      [key: string]: any
    }
    [key: string]: any
  }

  // Add useRuntimeConfig function type
  type UseRuntimeConfig = () => RuntimeConfig

  const useRuntimeConfig: UseRuntimeConfig | undefined
}

export interface ImportMetaEnv {
  MODE: string
  DEV: boolean
  PROD: boolean
  [key: string]: any
}

export interface ImportMeta {
  url: string
  env: ImportMetaEnv
  readonly hot?: {
    accept: () => void
    dispose: () => void
    invalidate: () => void
    [key: string]: any
  }
}

export {}
