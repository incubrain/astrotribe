import type { DomainConfig, CrossDomainConfig } from '../../apps/api/src/types'

export const domainMap: Record<string, string> = {
  // Content Domain
  contents: 'content',
  content_categories: 'content',
  content_sources: 'content',
  content_source_visits: 'content',
  content_statuses: 'content',
  content_tags: 'content',
  categories: 'content',
  tags: 'content',
  news: 'content',
  news_summaries: 'content',
  news_tags: 'content',
  newsletters: 'content',
  research: 'content',
  research_embeddings: 'content',
  feeds: 'content',
  feed_categories: 'content',
  feed_sources: 'content',
  embedding_reviews: 'content',

  // Auth/User Domain
  user_profiles: 'auth',
  user_metrics: 'auth',
  role_hierarchy: 'auth',
  role_permissions: 'auth',
  role_permissions_materialized: 'auth',
  plan_permissions: 'auth',

  // Organization Domain
  companies: 'org',
  company_contacts: 'org',
  company_employees: 'org',
  company_extras: 'org',
  company_metrics: 'org',
  company_urls: 'org',
  contacts: 'org',
  addresses: 'org',
  social_media: 'org',

  // Advertising Domain
  ads: 'advertising',
  ad_variants: 'advertising',
  ad_packages: 'advertising',
  ad_daily_metrics: 'advertising',

  // Engagement Domain
  bookmarks: 'engagement',
  bookmark_folders: 'engagement',
  comments: 'engagement',
  votes: 'engagement',
  follows: 'engagement',
  feedbacks: 'engagement',
  feature_rankings: 'engagement',
  feature_requests: 'engagement',

  // Payments Domain
  customer_payments: 'payments',
  customer_refunds: 'payments',
  customer_subscriptions: 'payments',
  customer_subscription_plans: 'payments',
  customer_processed_webhooks: 'payments',
  payment_providers: 'payments',

  // Search Domain
  searches: 'search',
  responses: 'search',

  // Security Domain
  blacklisted_domains: 'security',
  blacklisted_urls: 'security',
  classified_urls: 'security',

  // Monitoring Domain
  error_logs: 'monitoring',
  error_metrics: 'monitoring',
  spider_metrics: 'monitoring',
  metric_definitions: 'monitoring',

  // Location Domain
  countries: 'location',
  cities: 'location',

  // System Tables (typically excluded from API generation)
  table_maintenance_log: 'system',
  table_query_performance: 'system',
  table_sequence_usage: 'system',
  table_statistics: 'system',
}

// Function to infer domain from table name if not explicitly mapped
export function inferDomain(tableName: string): string {
  // Check explicit mapping first
  if (domainMap[tableName]) {
    return domainMap[tableName]
  }

  // Infer from table name patterns
  if (tableName.includes('user_') || tableName.includes('auth_')) {
    return 'auth'
  }
  if (tableName.includes('company_') || tableName.includes('org_')) {
    return 'org'
  }
  if (tableName.includes('content_') || tableName.includes('news_')) {
    return 'content'
  }
  if (tableName.includes('payment_') || tableName.includes('subscription_')) {
    return 'payments'
  }
  if (tableName.includes('metric_') || tableName.includes('log_')) {
    return 'monitoring'
  }

  // Default domain for tables that don't match any patterns
  return 'common'
}

export const domainConfig: Record<string, DomainConfig & CrossDomainConfig> = {
  content: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    supportsSoftDelete: true,
    supportsVersioning: true,
    allowedRelations: ['auth', 'org'],
    implicitRelations: {
      user: true,
      company: true,
    },
  },
  auth: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    sensitiveFields: ['password', 'token'],
    supportsSoftDelete: false,
    // Auth can relate to any domain
    allowedRelations: ['*'],
  },
  org: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    supportsSoftDelete: true,
    supportsVersioning: false,
    // Organizations can relate to most domains
    allowedRelations: ['auth', 'content', 'advertising', 'payments'],
    implicitRelations: {
      user: true,
    },
  },
  advertising: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    supportsSoftDelete: true,
    requiresCompany: true,
    allowedRelations: ['org', 'auth'],
    implicitRelations: {
      company: true,
    },
  },
  engagement: {
    requiresAuth: true,
    defaultPermissions: ['read', 'create'],
    supportsSoftDelete: false,
    requiresUser: true,
    allowedRelations: ['auth', 'content'],
    implicitRelations: {
      user: true,
    },
  },
  payments: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    sensitiveFields: ['card', 'bank'],
    requiresEncryption: true,
    allowedRelations: ['auth', 'org'],
    implicitRelations: {
      user: true,
      company: true,
    },
  },
  search: {
    requiresAuth: true,
    defaultPermissions: ['read', 'create'],
    supportsCaching: true,
    allowedRelations: ['auth'],
  },
  security: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    requiresAdmin: true,
    allowedRelations: [],
  },
  monitoring: {
    requiresAuth: true,
    defaultPermissions: ['read'],
    requiresAdmin: true,
    allowedRelations: [],
  },
  location: {
    requiresAuth: false,
    defaultPermissions: ['read'],
    supportsCaching: true,
    allowedRelations: ['org'],
  },
  system: {
    requiresAuth: true,
    defaultPermissions: [],
    requiresAdmin: true,
    exclude: true,
    allowedRelations: [],
  },
}

export type DomainName = keyof typeof domainConfig
