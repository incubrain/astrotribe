// config.ts
export const SERVICE_NAMES = {
  API_GATEWAY: 'api-gateway',
  AUTH_SERVICE: '@astronera/auth',
  USER_SERVICE: 'user-service',
  PAYMENT_SERVICE: 'payment-service',
  CONTENT_SERVICE: 'content-service',
  ADMIN_SERVICE: 'admin-dashboard',
  SEARCH_SERVICE: 'search-service',
  ANALYTICS_SERVICE: 'analytics-service',
  NOTIFICATION_SERVICE: 'notification-service',
} as const

export type ServiceName = (typeof SERVICE_NAMES)[keyof typeof SERVICE_NAMES]

// Validate service name
export function validateServiceName(name: string): ServiceName {
  if (Object.values(SERVICE_NAMES).includes(name as ServiceName)) {
    return name as ServiceName
  }
  throw new Error(
    `Invalid service name: ${name}. Must be one of: ${Object.values(SERVICE_NAMES).join(', ')}`,
  )
}
