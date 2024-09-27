interface ErrorMessage {
  userMessage: string // User-friendly error message if needed
  devMessage: string // Make bugfixing easy!
  error: any
}

interface ErrorServer extends Omit<ErrorMessage, 'error'> {
  featureRelated?: boolean // default false - log to feature-specific log
  response: { data: any, error: any }
}

export function useServerError(loggerPrefix = 'useServerError') {
  const log = useServerLogger(loggerPrefix)
  const isDev = process.env.NODE_ENV === 'development'

  function formatErrorMessage({ userMessage, devMessage, error }: ErrorMessage) {
    const devError = `${devMessage}: ${JSON.stringify(error)}`
    log.error(devError)
    const userError = userMessage || 'An unexpected error occurred. Please try again later.'
    return isDev ? devError : userError
  }

  function handleError({ userMessage, devMessage, error }: ErrorMessage) {
    const errorMessage = formatErrorMessage({ error, userMessage, devMessage })
    log.error(`Critical Error: ${errorMessage}`)

    throw createError({
      message: `SERVER ERROR: ${errorMessage}`,
      statusCode: 500,
      statusMessage: 'Internal Server Error',
    })
  }

  function handleFetchError({ response, devMessage, userMessage }: ErrorServer) {
    if (response.error) {
      log.error(`FETCH Error: ${response.error}`)
      handleError({
        error: response.error,
        userMessage,
        devMessage,
      })
    } else if (response.data) {
      log.info(`Successfully fetched ${response.data.length} items`)
      return response.data
    } else {
      log.info('Nothing returned from fetch')
      throw createError({
        message: 'No data found',
        statusCode: 404,
        statusMessage: 'Not Found',
      })
    }
  }

  return {
    handleFetchError,
    handleError,
  }
}

export function handleDBErrors(response: { data?: any, error?: any }, logger: any) {
  if (response.error) {
    logger.error(`handleDBErrors - Supabase Error: ${response.error.message}`)
    throw createError({ message: response.error.message })
  } else if (response.data) {
    return response.data
  }
  return null
}
