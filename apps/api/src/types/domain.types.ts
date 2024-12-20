// Original interfaces remain the same
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
