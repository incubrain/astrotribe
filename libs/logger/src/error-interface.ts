import type { ErrorSeverity, ErrorType } from '@astronera/db'

export interface ErrorMessage {
  userMessage: string // User-friendly error message if needed
  devMessage: string // Make bugfixing easy!
  error: any
}

export interface ErrorServer extends Omit<ErrorMessage, 'error'> {
  featureRelated?: boolean // default false - log to feature-specific log
  response: { data: any; error: any }
}

// Retryable status codes with descriptions
export const retryableStatusCodes: { [key: number]: string } = {
  408: 'Request Timeout - The server timed out waiting for the request.',
  409: 'Conflict - The request could not be completed due to a conflict with the current state of the target resource.',
  425: 'Too Early - The server is unwilling to risk processing a request that might be replayed.',
  500: 'Internal Server Error - The server encountered an unexpected condition that prevented it from fulfilling the request.',
  502: 'Bad Gateway - The server, while acting as a gateway or proxy, received an invalid response from an inbound server.',
  503: 'Service Unavailable - The server is currently unable to handle the request due to temporary overloading or maintenance of the server.',
  504: 'Gateway Timeout - The server, while acting as a gateway or proxy, did not receive a timely response from an upstream server.',
}

export type error_type = ErrorType

export interface ErrorDetails {
  type: ErrorType
  message: string
  severity: ErrorSeverity
  stack?: string
  code?: string | number
  context?: string
  pgError?: string
  operation?: string
  originalError?: any
}

export interface ErrorHandlerOptions {
  context?: string
  userMessage?: string
  devMessage?: string
  throwError?: boolean
}

export interface FetchErrorResponse {
  data?: any
  error?: any
}

export function mapErrorSeverity(error: any): ErrorSeverity {
  if (error.status >= 500) return 'critical'
  if (error.status === 429) return 'high'

  // Connection errors are critical
  if (error.code?.startsWith('08')) return 'critical'

  // Authentication errors are high severity
  if (error.code?.startsWith('28')) return 'high'

  // Constraint violations are high severity
  if (error.code?.startsWith('23')) return 'high'

  // Query errors are medium severity
  if (error.code?.startsWith('42')) return 'medium'

  // Data exceptions are medium severity
  if (error.code?.startsWith('22')) return 'medium'

  // Transaction errors are high severity
  if (error.code === '40001' || error.code === '40P01') return 'high'

  // System errors are critical
  if (error.code?.startsWith('53')) return 'critical'

  // Default to medium severity for unknown errors
  return 'medium'
}

export function mapErrorType(error: any): ErrorType {
  // Connection errors
  if (
    error.code === '08000' ||
    error.code === '08003' ||
    error.code === '08006' ||
    error.code === '08001' ||
    error.code === '08004'
  ) {
    return 'CONNECTION_ERROR'
  }

  // Authentication errors
  if (error.code === '28000' || error.code === '28P01') {
    return 'AUTHENTICATION_ERROR'
  }

  // Constraint violations
  if (error.code === '23505') return 'DATABASE_ERROR'
  if (error.code === '23503') return 'DATABASE_ERROR'
  if (error.code === '23502') return 'DATABASE_ERROR'
  if (error.code?.startsWith('23') && !['23505', '23503', '23502'].includes(error.code))
    return 'DATABASE_ERROR'

  // Query errors
  if (error.code === '42P01') return 'TABLE_ERROR'
  if (error.code === '42P02') return 'DATABASE_ERROR'
  if (error.code === '42601') return 'DATABASE_ERROR'
  if (error.code === '42P07') return 'DATABASE_ERROR'
  if (error.code === '42703') return 'DATABASE_ERROR'

  // Data errors
  if (error.code?.startsWith('22')) return 'DATABASE_ERROR'

  // Transaction errors
  if (error.code === '40001') return 'DATABASE_ERROR'
  if (error.code === '40P01') return 'DATABASE_ERROR'

  // System errors
  if (
    error.code === '53000' ||
    error.code === '53100' ||
    error.code === '53200' ||
    error.code === '53300'
  ) {
    return 'SERVER_ERROR'
  }

  // HTTP-specific errors
  if (error.status === 429) return 'NETWORK_ERROR'
  if (error.status >= 500) return 'SERVER_ERROR'

  // Catch-all for unspecified errors
  return 'UNKNOWN_ERROR'
}

export interface LogLevels {
  error: 0
  warn: 1
  info: 2
  http: 3
  verbose: 4
  debug: 5
  silly: 6
}

export class AppError extends Error {
  details: ErrorDetails

  constructor(details: ErrorDetails) {
    super(details.message)
    this.details = details
    this.name = 'AppError'
  }
}

export interface Logger {
  error: (message: string, ...args: any[]) => void
  warn: (message: string, ...args: any[]) => void
  info: (message: string, ...args: any[]) => void
  verbose: (message: string, ...args: any[]) => void
  debug: (message: string, ...args: any[]) => void
  silly: (message: string, ...args: any[]) => void
  http: (message: string, ...args: any[]) => void
}

export interface LogMetadata {
  service: string
  environment: string
  timestamp: string
  correlationId?: string
  requestId?: string
  userId?: string
  browser?: string
  os?: string
  ip?: string
  path?: string
  method?: string
  component?: string
  version?: string
  [key: string]: any
}

export interface LogContext {
  action?: string
  component?: string
  version?: string
  [key: string]: any
}

export interface ErrorLogEntry {
  id: string
  service_name: string
  domain?: string
  error_type?: error_type
  severity: ErrorSeverity
  message: string
  stack_trace?: string
  metadata?: Partial<LogMetadata> // Make it optional and partial
  context?: LogContext
  user_id?: string
  request_id?: string
  correlation_id?: string
  environment: string
  created_at: string
}
