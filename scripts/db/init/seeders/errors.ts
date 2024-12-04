import { faker } from '@faker-js/faker'
import type { Pool } from 'pg'
import { generateUUID, bulkInsert } from './seed-helpers'

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
  'auth-service',
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
