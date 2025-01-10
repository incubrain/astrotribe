// environment.d.ts
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      DATABASE_URL?: string
      SERVICE_NAME?: string
    }
  }
}

export interface Environment {
  isDev: boolean
  databaseUrl: string
  serviceName: string
}

export {}
