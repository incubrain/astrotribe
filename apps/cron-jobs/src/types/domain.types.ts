import { Service } from '@ib/logger'

export type DomainsForService<T extends Service> = T extends Service.JOBS
  ?
      | 'test'
      | 'circuit_breaker'
      | 'api'
      | 'errors'
      | 'metrics'
      | 'analytics'
      | 'jobs'
      | 'news_links'
      | 'job_events'
      | 'job_versions'
      | 'job_shutdown'
      | 'url_classifier'
      | 'url_spider'
      | 'scraper'
      | 'crawler'
      | 'spider'
      | 'news'
  : never

// Original interfaces remain the same
export enum Priority {
  Critical = 100,
  High = 75,
  Normal = 50,
  Low = 25,
}

export type PriorityLevel = keyof typeof Priority

export interface DomainConfig {
  requiresAuth: boolean
  defaultPermissions: string[]
  supportsSoftDelete?: boolean
  supportsVersioning?: boolean
  requiresCompany?: boolean
  requiresUser?: boolean
  requiresEncryption?: boolean
  supportsCaching?: boolean
  requiresAdmin?: boolean
  sensitiveFields?: string[]
  exclude?: boolean
}

export interface CrossDomainConfig {
  allowedRelations: string[]
  implicitRelations?: {
    user?: boolean
    company?: boolean
  }
}

export interface LoggerConfig {
  domainName: string
  subContexts?: string[]
}
