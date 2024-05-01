interface ErrorContext {
  userMessage: string // User-friendly error message if needed
  devMessage: string // Make bugfixing easy!
  critical: boolean // Flag to indicate if the error is critical
}

export function useBaseError() {
  const toast = useToast()
  const logger = useLogger('useBaseError')
  const isAdmin = true

  function formatErrorMessage(error: any, context: ErrorContext) {
    const devError = `${context.devMessage}: ${error.message || JSON.stringify(error)}`
    logger.error(devError)

    const userError = context.userMessage || 'An unexpected error occurred. Please try again later.'

    return isAdmin ? devError : userError
  }

  function handleError(error: any, context: ErrorContext, isServer = false) {
    // Determine the appropriate user message
    const errorMessage = formatErrorMessage(error, context)

    // Add an error toast notification with an option to retry if an action is provided
    toast.add({
      summary: `${isServer ? 'SERVER' : 'CLIENT'} ERROR`,
      detail: errorMessage,
      severity: 'error',
      life: 0,
      closable: true
    })

    // Handle critical errors specifically if needed
    if (context.critical) {
      // Here you could navigate to an error page, log out the user, etc.
      console.log('Handling critical error for:', context.devMessage)
    }

    throw createError({
      message: `${isServer ? 'SERVER' : 'CLIENT'} ERROR ${errorMessage}`
    })
  }

  function handleFetchErrors(response: { data?: any; error?: any }, context: ErrorContext) {
    if (response.error) {
      // Log the error with more context
      const errorMessage = formatErrorMessage(response.error, context)
      handleError(response.error, context, true)
    } else if (response.data) {
      logger.info(`Successfully fetched ${response.data.length} ${response}`)
      return response.data
    }
    logger.info(`No ${context.dataType} returned from database`)
    return null
  }

  return {
    handleFetchErrors,
    handleError
  }
}
