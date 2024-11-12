// utils/error-handler.ts
import { createLogger } from './logger'
import { getEnvironment } from './environment'
import {
  ErrorType,
  ErrorSeverity,
  AppError,
  mapErrorType,
  mapErrorSeverity,
  retryableStatusCodes,
  type ErrorHandlerOptions,
  type FetchErrorResponse,
} from './error-interface'

export class ErrorHandler {
  private logger
  private env = getEnvironment()

  constructor(private context = 'ErrorHandler') {
    this.logger = createLogger(context)
  }

  private determineErrorType(error: any): ErrorType {
    if (error instanceof AppError) return error.details.type
    return mapErrorType(error)
  }

  private determineSeverity(error: any): ErrorSeverity {
    if (error instanceof AppError) return error.details.severity
    return mapErrorSeverity(error)
  }

  private formatErrorMessage(options: {
    userMessage?: string
    devMessage: string
    error: any
  }): string {
    const { userMessage, devMessage, error } = options
    const devError = `${devMessage}: ${JSON.stringify(error)}`
    this.logger.error(devError)
    return this.env.isDev ? devError : userMessage || 'An unexpected error occurred'
  }

  private normalizeError(error: Error | AppError, context?: string): AppError {
    if (error instanceof AppError) {
      return error
    }

    const errorType = this.determineErrorType(error)
    const severity = this.determineSeverity(error)

    return new AppError({
      type: errorType,
      message: error.message,
      severity,
      stack: error.stack,
      context,
      code: (error as any).code,
      pgError: (error as any).details || (error as any).hint,
      operation: context,
      originalError: error,
    })
  }

  private getErrorStatusCode(errorType: ErrorType): number {
    switch (errorType) {
      case ErrorType.AUTHENTICATION_ERROR:
        return 401
      case ErrorType.VALIDATION_ERROR:
        return 400
      case ErrorType.NOT_FOUND_ERROR:
        return 404
      case ErrorType.RATE_LIMIT_ERROR:
        return 429
      case ErrorType.CONSTRAINT_ERROR:
      case ErrorType.UNIQUE_VIOLATION:
      case ErrorType.FOREIGN_KEY_VIOLATION:
        return 409
      default:
        return 500
    }
  }

  handleError(error: Error | AppError, options: ErrorHandlerOptions = {}) {
    const appError = this.normalizeError(error, options.context)

    this.logger.error(`${appError.details.type}: ${appError.message}`, {
      ...appError.details,
      stack: this.env.isDev ? appError.stack : undefined,
    })

    // Handle server-side errors
    if (this.env.isNode) {
      const errorMessage = this.formatErrorMessage({
        userMessage: options.userMessage || appError.message,
        devMessage: options.devMessage || appError.details.type,
        error: appError,
      })

      if (options.throwError) {
        const serverError = new Error()
        serverError.message = `SERVER ERROR: ${errorMessage}`
        ;(serverError as any).statusCode = this.getErrorStatusCode(appError.details.type)
        ;(serverError as any).statusMessage = appError.message
        ;(serverError as any).data = {
          error: {
            type: appError.details.type,
            message: appError.message,
            severity: appError.details.severity,
            details: this.env.isDev ? appError.details : undefined,
          },
        }
        throw serverError
      }
    }

    // Handle critical errors
    if (appError.details.severity === ErrorSeverity.CRITICAL) {
      // Add critical error handling logic
      this.handleCriticalError(appError)
    }

    return appError
  }

  handleFetchError({
    response,
    devMessage,
    userMessage,
  }: {
    response: FetchErrorResponse
    devMessage: string
    userMessage?: string
  }) {
    if (response.error) {
      this.logger.error(`FETCH Error: ${response.error}`)
      return this.handleError(response.error, { userMessage, devMessage })
    }

    if (response.data) {
      this.logger.info(
        `Successfully fetched ${Array.isArray(response.data) ? response.data.length : 1} items`,
      )
      return response.data
    }

    this.logger.info('Nothing returned from fetch')
    return this.handleError(new Error('No data found'), {
      userMessage: 'Resource not found',
      devMessage: 'Fetch returned empty response',
    })
  }

  handleDBError(response: FetchErrorResponse, context: string) {
    if (response.error) {
      return this.handleError(response.error, {
        context,
        devMessage: `Database error in ${context}`,
        userMessage: 'Database operation failed',
      })
    }
    return response.data
  }

  private handleCriticalError(error: AppError) {
    // Implement critical error handling
    this.logger.error('CRITICAL ERROR:', error.details)
    // Could trigger alerts, notifications, etc.
  }
}

// Factory function
export function createErrorHandler(context = 'ErrorHandler') {
  const handler = new ErrorHandler(context)

  return {
    handleError: handler.handleError.bind(handler),
    handleFetchError: handler.handleFetchError.bind(handler),
    handleDBError: handler.handleDBError.bind(handler),
  }
}

// Convenience function for framework integration
export const useErrorHandler = (context = 'ErrorHandler') => {
  return createErrorHandler(context)
}
