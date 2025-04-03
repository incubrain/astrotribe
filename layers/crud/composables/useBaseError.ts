import { createError } from 'h3'
import { useLogger } from '#imports'
import { useRuntimeConfig } from '#app'

interface ErrorMessage {
  userMessage: string // User-friendly error message if needed
  devMessage: string // Make bugfixing easy!
  error: any
}

interface ErrorServer extends Omit<ErrorMessage, 'error'> {
  devOnly: boolean // default true - don't show toasts in production
  featureRelated?: boolean // default false - log to feature-specific log
  response: { data: any; error: any }
}

interface ErrorClient extends ErrorMessage {
  isServer?: boolean // default false
  featureRelated?: boolean // default false - log to feature-specific log
  devOnly: boolean
}

export function useBaseError() {
  // !todo:med:easy - add prefix to base error

  // const toast = useNotification()
  const logger = useLogger('useBaseError')
  const isAdmin = useRuntimeConfig().public.nodeEnv === 'development'

  // function handleErrorWithCodes(error: any) {
  //   switch (error.statusCode) {
  //     case 429:
  //       toast.feature({
  //         summary: error.statusMessage,
  //         message: error.message,
  //       })
  //       break
  //     case 403:
  //       toast.error({
  //         summary: error.statusMessage,
  //         message: error.message,
  //       })
  //       break
  //     default:
  //       console.error('Unhandled feature error:', error)
  //   }
  // }

  function formatErrorMessage({ userMessage, devMessage, error }: ErrorMessage) {
    const devError = `${devMessage}: ${JSON.stringify(error)}`
    logger.error(devError)
    const userError = userMessage || 'An unexpected error occurred. Please try again later.'
    return isAdmin ? devError : userError
  }

  function handleError({
    userMessage,
    devMessage,
    devOnly = true,
    isServer = false,
    error,
  }: ErrorClient) {
    // Determine the appropriate user message
    const errorMessage = formatErrorMessage({ error, userMessage, devMessage })

    // Add an error toast notification with an option to retry if an action is provided

    // Handle critical errors specifically if needed
    if (!devOnly || isAdmin) {
      // toast.error({
      //   summary: 'Error',
      //   message: errorMessage,
      // })
      // Here you could navigate to an error page, log out the user, etc.
      console.error('Handling critical error for:', devMessage)
    }

    throw createError({
      message: `${isServer ? 'SERVER' : 'CLIENT'} ERROR: ${errorMessage}`,
    })
  }

  function handleServerError({ response, devMessage, devOnly, userMessage }: ErrorServer) {
    if (!response) {
      logger.error(`${devMessage}: Response is undefined`)
      handleError({
        error: new Error('Response is undefined'),
        devOnly,
        userMessage: userMessage || 'Server response is missing',
        isServer: true,
        devMessage,
      })
      return null
    }

    if (response.error) {
      console.log('FeatError', response.error)
      handleError({
        error: response.error,
        devOnly,
        userMessage,
        isServer: true,
        devMessage,
      })
      return null
    } else if (response.data) {
      logger.info(`Successfully fetched ${Array.isArray(response.data) ? response.data.length : 'data'}`)
      return response.data
    }
    logger.info('Nothing returned from database')
    return null
  }

  return {
    server: handleServerError,
    client: handleError,
  }
}
