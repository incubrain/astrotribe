export default defineNuxtPlugin((nuxtApp) => {
  // Set up global error handlers
  if (import.meta.client) {
    window.addEventListener('error', (event) => {
      logger.error(event.error, 'Uncaught Exception')
    })

    window.addEventListener('unhandledrejection', (event) => {
      logger.error(event.reason, 'Unhandled Promise Rejection')
    })
  }
})
