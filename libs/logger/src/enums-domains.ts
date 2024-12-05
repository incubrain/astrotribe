const CORE_DOMAINS = ['api', 'errors', 'metrics', 'analytics'] as const
const AUTH_DOMAINS = ['auth', 'user-management', 'permissions'] as const
const UI_DOMAINS = ['ui', 'components'] as const
const STORAGE_DOMAINS = ['storage', 'upload'] as const
const CONTENT_DOMAINS = ['content', 'blog', 'news', 'feeds'] as const
const SOCIAL_DOMAINS = ['social', 'notifications'] as const
const MONITORING_DOMAINS = ['monitoring', 'error-logs', 'metrics'] as const
const SYSTEM_DOMAINS = ['database', 'redis', 'server-jobs', 'websocket'] as const

// Admin-specific domains
const ADMIN_SPECIFIC = [
  'business-systems',
  'business-plan',
  'features',
  'tasks',
  'spider',
  'classifier',
] as const

// Main app specific domains
const MAIN_APP_SPECIFIC = ['bookmarks', 'search', 'payments'] as const

export enum Service {
  // Main Applications
  ADMIN_DASHBOARD = 'admin-dashboard',
  AUTH_SERVICE = 'auth-service',
  MAIN_APP = 'main-app',
  MONITORING = 'monitoring-dashboard',
  WEBSITE = 'website',
  CMS = 'cms',

  // Extensions
  CHROME_EXTENSION = 'chrome-extension',
}

export const ServiceDomains = {
  'admin-dashboard': [
    ...CORE_DOMAINS,
    ...AUTH_DOMAINS,
    ...MONITORING_DOMAINS,
    ...SYSTEM_DOMAINS,
    ...STORAGE_DOMAINS,
    ...ADMIN_SPECIFIC,
  ],
  'auth-service': [...CORE_DOMAINS, ...AUTH_DOMAINS],
  'main-app': [
    ...CORE_DOMAINS,
    ...AUTH_DOMAINS,
    ...UI_DOMAINS,
    ...STORAGE_DOMAINS,
    ...CONTENT_DOMAINS,
    ...SOCIAL_DOMAINS,
    ...MAIN_APP_SPECIFIC,
  ],
  'monitoring-dashboard': [...CORE_DOMAINS, ...MONITORING_DOMAINS, ...SYSTEM_DOMAINS],
  'website': [...CORE_DOMAINS, ...UI_DOMAINS, ...CONTENT_DOMAINS, 'search'],
  'cms': [...CORE_DOMAINS, ...AUTH_DOMAINS, ...STORAGE_DOMAINS, ...CONTENT_DOMAINS],
  'chrome-extension': ['api', 'errors', ...UI_DOMAINS, ...STORAGE_DOMAINS, 'bookmarks'],
} as const

export type ServiceToDomain = {
  [S in Service]: (typeof ServiceDomains)[S][number]
}

// Type helper to get domains for a service
export type DomainsForService<S extends Service> = ServiceToDomain[S]
