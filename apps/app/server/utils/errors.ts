export const handleFeatureLimitError = (error: any) => {
  // Feature limit errors
  if (error.statusCode === 403) {
    throw createError({
      statusCode: 403,
      message: error.message || 'Feature limit reached',
      data: {
        code: 'FEATURE_LIMIT_REACHED',
      },
    })
  }

  // Auth errors
  if (error.statusCode === 401) {
    throw createError({
      statusCode: 401,
      message: 'Authentication required',
      data: {
        code: 'AUTH_REQUIRED',
      },
    })
  }

  // Validation errors
  if (error.statusCode === 400) {
    throw createError({
      statusCode: 400,
      message: error.message || 'Invalid request',
      data: {
        code: 'VALIDATION_ERROR',
      },
    })
  }

  // Default error
  throw createError({
    statusCode: error.statusCode || 500,
    message: error.message || 'An unexpected error occurred',
    data: {
      code: 'INTERNAL_SERVER_ERROR',
    },
  })
}
