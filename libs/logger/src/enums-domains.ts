const CORE_DOMAINS = ['api', 'errors', 'metrics', 'analytics'] as const
const AUTH_DOMAINS = ['auth', 'user-management', 'permissions'] as const
const UI_DOMAINS = ['ui', 'components'] as const
const STORAGE_DOMAINS = ['storage', 'upload'] as const
const CONTENT_DOMAINS = ['content', 'blog', 'news', 'feeds'] as const
const SOCIAL_DOMAINS = ['social', 'notifications'] as const
const MONITORING_DOMAINS = ['monitoring', 'error-logs', 'metrics'] as const
const SYSTEM_DOMAINS = ['database', 'redis', 'websocket'] as const
const API_DOMAINS = [
  'monitoring',
  'cron',
  'agents',
  'validation',
  'filter',
  'logging',
  'webhook',
] as const
const URLS = ['url_classifier', 'url_spider'] as const
const SCRAPERS = ['scraper', 'crawler', 'spider'] as const

// Admin-specific domains
const ADMIN_SPECIFIC = [
  'business-systems',
  'business-plan',
  'features',
  'tasks',
  'spider',
  'classifier',
  'users',
  'referrals',
  'billing',
  'growth',
] as const

// Main app specific domains
const APP_SPECIFIC = ['bookmarks', 'search', 'payments'] as const

export enum Service {
  // Main Applications
  ADMIN = 'admin',
  AUTH = 'auth',
  APP = 'app',
  MONITORING = 'monitoring',
  WEBSITE = 'website',
  API = 'api',

  // Extensions
  CHROME_EXTENSION = 'chrome-extension',
}

export const ServiceDomains = {
  'admin': [
    ...CORE_DOMAINS,
    ...AUTH_DOMAINS,
    ...MONITORING_DOMAINS,
    ...SYSTEM_DOMAINS,
    ...STORAGE_DOMAINS,
    ...ADMIN_SPECIFIC,
  ],
  'auth': [...CORE_DOMAINS, ...AUTH_DOMAINS],
  'app': [
    ...CORE_DOMAINS,
    ...AUTH_DOMAINS,
    ...UI_DOMAINS,
    ...STORAGE_DOMAINS,
    ...CONTENT_DOMAINS,
    ...SOCIAL_DOMAINS,
    ...APP_SPECIFIC,
  ],
  'monitoring': [...CORE_DOMAINS, ...MONITORING_DOMAINS, ...SYSTEM_DOMAINS],
  'website': [...CORE_DOMAINS, ...UI_DOMAINS, ...CONTENT_DOMAINS, 'search'],
  'chrome-extension': ['api', 'errors', ...UI_DOMAINS, ...STORAGE_DOMAINS, 'bookmarks'],
  'api': [...CORE_DOMAINS, ...AUTH_DOMAINS, ...STORAGE_DOMAINS, ...CONTENT_DOMAINS, ...API_DOMAINS],
} as const

export type ServiceToDomain = { [S in Service]: (typeof ServiceDomains)[S][number] }

// Type helper to get domains for a service
export type DomainsForService<S extends Service> = ServiceToDomain[S]
