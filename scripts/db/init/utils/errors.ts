import { faker } from '@faker-js/faker'

export const ERROR_MESSAGES = [
  'Failed to connect to database',
  'Authentication token expired',
  'Invalid request parameters',
  'Network timeout while fetching data',
  'Resource not found',
  'Permission denied',
  'Rate limit exceeded',
  'Invalid file format',
  'Service unavailable',
  'Unexpected server error',
]

export const SERVICE_NAMES = [
  'api-gateway',
  'astronera/auth',
  'user-service',
  'content-service',
  'notification-service',
  'search-service',
  'analytics-service',
  'payment-service',
]

export const ERROR_TYPES = [
  'UPLOAD_ERROR',
  'CONNECTION_ERROR',
  'AUTHENTICATION_ERROR',
  'VALIDATION_ERROR',
  'NOT_FOUND_ERROR',
  'SERVER_ERROR',
  'NETWORK_ERROR',
  'DATABASE_ERROR',
  'UNKNOWN_ERROR',
]

export const SEVERITIES = ['low', 'medium', 'high', 'critical']

export const COMMON_ERRORS = [
  {
    message: 'Service unavailable',
    pattern: 'Service unavailable',
    hash: 'b57973df2513f0659c652aa7de3b870d',
    services: ['astronera/auth', 'api-gateway', 'user-service'],
  },
  {
    message: 'Rate limit exceeded',
    pattern: 'Rate limit exceeded',
    hash: '8ab7b53038c4ee09174f4045787f2376',
    services: ['user-service', 'api-gateway', 'content-service'],
  },
  {
    message: 'Authentication token expired',
    pattern: 'Authentication token expired',
    hash: 'f70f185c04fb7b8d43479355106d4df0',
    services: ['astronera/auth', 'user-service', 'notification-service'],
  },
]

export function generateStackTrace(errorMessage: string): string {
  const randomFile = faker.system.fileName()
  const randomLine = faker.number.int({ min: 1, max: 1000 })
  const randomFunction = faker.hacker.verb() + faker.hacker.noun()

  return `Error: ${errorMessage}
    at ${randomFunction} (${randomFile}:${randomLine}:${faker.number.int({ min: 1, max: 100 })})
    at processTicksAndRejections (internal/process/task_queues.js:95:5)
    at async ${faker.hacker.verb()}${faker.hacker.noun()} (${faker.system.fileName()}:${faker.number.int({ min: 1, max: 1000 })}:${faker.number.int({ min: 1, max: 100 })})
    at async ${faker.hacker.verb()}${faker.hacker.noun()} (${faker.system.fileName()}:${faker.number.int({ min: 1, max: 1000 })}:${faker.number.int({ min: 1, max: 100 })})`
}
