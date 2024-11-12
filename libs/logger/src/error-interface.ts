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

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum ErrorType {
  UPLOAD_ERROR = 'UPLOAD_ERROR',
  CONNECTION_ERROR = 'CONNECTION_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  UNIQUE_VIOLATION = 'UNIQUE_VIOLATION',
  FOREIGN_KEY_VIOLATION = 'FOREIGN_KEY_VIOLATION',
  NOT_NULL_VIOLATION = 'NOT_NULL_VIOLATION',
  CONSTRAINT_ERROR = 'CONSTRAINT_ERROR',
  UNDEFINED_TABLE = 'UNDEFINED_TABLE',
  UNDEFINED_PARAMETER = 'UNDEFINED_PARAMETER',
  SYNTAX_ERROR = 'SYNTAX_ERROR',
  DUPLICATE_ALIAS = 'DUPLICATE_ALIAS',
  UNDEFINED_COLUMN = 'UNDEFINED_COLUMN',
  DATA_EXCEPTION = 'DATA_EXCEPTION',
  SERIALIZATION_FAILURE = 'SERIALIZATION_FAILURE',
  DEADLOCK_DETECTED = 'DEADLOCK_DETECTED',
  INSUFFICIENT_RESOURCES = 'INSUFFICIENT_RESOURCES',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
}

// Types
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
  if (error.status >= 500) return ErrorSeverity.CRITICAL
  if (error.status === 429) return ErrorSeverity.HIGH

  // Connection errors are critical
  if (error.code?.startsWith('08')) return ErrorSeverity.CRITICAL

  // Authentication errors are high severity
  if (error.code?.startsWith('28')) return ErrorSeverity.HIGH

  // Constraint violations are high severity
  if (error.code?.startsWith('23')) return ErrorSeverity.HIGH

  // Query errors are medium severity
  if (error.code?.startsWith('42')) return ErrorSeverity.MEDIUM

  // Data exceptions are medium severity
  if (error.code?.startsWith('22')) return ErrorSeverity.MEDIUM

  // Transaction errors are high severity
  if (error.code === '40001' || error.code === '40P01') return ErrorSeverity.HIGH

  // System errors are critical
  if (error.code?.startsWith('53')) return ErrorSeverity.CRITICAL

  // Default to medium severity for unknown errors
  return ErrorSeverity.MEDIUM
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
    return ErrorType.CONNECTION_ERROR
  }

  // Authentication errors
  if (error.code === '28000' || error.code === '28P01') {
    return ErrorType.AUTHENTICATION_ERROR
  }

  // Constraint violations
  if (error.code === '23505') return ErrorType.UNIQUE_VIOLATION
  if (error.code === '23503') return ErrorType.FOREIGN_KEY_VIOLATION
  if (error.code === '23502') return ErrorType.NOT_NULL_VIOLATION
  if (error.code?.startsWith('23') && !['23505', '23503', '23502'].includes(error.code))
    return ErrorType.CONSTRAINT_ERROR

  // Query errors
  if (error.code === '42P01') return ErrorType.UNDEFINED_TABLE
  if (error.code === '42P02') return ErrorType.UNDEFINED_PARAMETER
  if (error.code === '42601') return ErrorType.SYNTAX_ERROR
  if (error.code === '42P07') return ErrorType.DUPLICATE_ALIAS
  if (error.code === '42703') return ErrorType.UNDEFINED_COLUMN

  // Data errors
  if (error.code?.startsWith('22')) return ErrorType.DATA_EXCEPTION

  // Transaction errors
  if (error.code === '40001') return ErrorType.SERIALIZATION_FAILURE
  if (error.code === '40P01') return ErrorType.DEADLOCK_DETECTED

  // System errors
  if (
    error.code === '53000' ||
    error.code === '53100' ||
    error.code === '53200' ||
    error.code === '53300'
  ) {
    return ErrorType.INSUFFICIENT_RESOURCES
  }

  // HTTP-specific errors
  if (error.status === 429) return ErrorType.RATE_LIMIT_ERROR
  if (error.status >= 500) return ErrorType.SERVER_ERROR

  // Catch-all for unspecified errors
  return ErrorType.UNKNOWN_ERROR
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
