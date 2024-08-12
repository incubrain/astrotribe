import { useErrorHandler } from "#imports"

export default defineNuxtPlugin((nuxtApp) => {
  const { handleError } = useErrorHandler()

  // Set up global error handlers
  if (import.meta.client) {
    window.addEventListener('error', (event) => {
      handleError(event.error, 'Uncaught Exception')
    })

    window.addEventListener('unhandledrejection', (event) => {
      handleError(event.reason, 'Unhandled Promise Rejection')
    })
  }
})
