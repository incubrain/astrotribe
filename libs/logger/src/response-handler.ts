// @ib/logger/src/response-handler.ts
import { createError } from 'h3'
import type { Logger } from './error-interface'

export const handleResponse = async <T>(
  logger: Logger,
  operation: () => Promise<T>,
  context: string,
  options: {
    successMessage?: string
    errorMessage?: string
  } = {},
): Promise<T> => {
  try {
    const result = await operation()
    logger.info(options.successMessage || `${context} succeeded`)
    return result
  } catch (error: any) {
    logger.error(options.errorMessage || `${context} failed`, {
      error,
      context,
    })
    throw createError({
      statusCode: error?.statusCode || 500,
      message: options.errorMessage || `${context} failed: ${error.message}`,
    })
  }
}
