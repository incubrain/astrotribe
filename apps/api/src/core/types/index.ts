export interface DomainConfig {
  requiresAuth?: boolean
  requiresUser?: boolean
  requiresCompany?: boolean
}

export interface CrossDomainConfig {
  // Add any cross-domain configuration options
}

export interface LoggerConfig {
  domainName: string
  subContexts?: string[]
}
