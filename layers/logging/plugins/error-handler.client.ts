// plugins/error-handler.client.ts
export default defineNuxtPlugin((nuxtApp) => {
  const logger = useLogger('app')

  // Handle Vue errors
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    logger.handleComponentError(error, instance?.$options?.name, info)
  }

  if (import.meta.client) {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      logger.error('Unhandled promise rejection', {
        error: event.reason,
        promise: event.promise,
      })
    })

    // Handle runtime errors
    window.addEventListener('error', (event) => {
      logger.error('Runtime error', {
        error: event.error,
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    })

    const config = useRuntimeConfig().public

    // Optional: Monitor performance
    if (config.debug) {
      window.addEventListener('load', () => {
        const performance = window.performance
        if (performance) {
          setTimeout(() => {
            const timing = performance.getEntriesByType(
              'navigation',
            )[0] as PerformanceNavigationTiming
            if (timing.duration > 3000) {
              // 3 seconds threshold
              logger.warn('Slow page load detected', {
                duration: timing.duration,
                dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                connectTime: timing.connectEnd - timing.connectStart,
                responseTime: timing.responseEnd - timing.responseStart,
                domTime: timing.domComplete - timing.domInteractive,
                loadTime: timing.loadEventEnd - timing.loadEventStart,
              })
            }
          }, 0)
        }
      })
    }
  }

  // Provide logger globally
  return {
    provide: {
      logger,
    },
  }
})
