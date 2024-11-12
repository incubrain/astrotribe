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
