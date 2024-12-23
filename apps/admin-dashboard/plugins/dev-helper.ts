export default defineNuxtPlugin((nuxtApp) => {
  const logger = useLogger('devHelper')
  const config = useRuntimeConfig()

  // Default configuration with type safety
  const defaultConfig = {
    enabled: process.env.NODE_ENV === 'development',
    features: {
      networkErrorClassifier: true,
      infiniteLoopDetector: true,
      unhandledPromiseRejectionTracker: true,
      environmentConsistencyChecker: true,
    },
  }

  const devHelperConfig = {
    enabled: config.public?.devHelper?.enabled ?? defaultConfig.enabled,
    features: {
      ...defaultConfig.features,
      ...config.public?.devHelper?.features,
    },
  }

  const DevHelper = {
    features: { ...devHelperConfig.features },

    toggleFeature(feature: string, enabled: boolean) {
      if (feature in this.features) {
        this.features[feature] = enabled
        logger.info(`Feature '${feature}' ${enabled ? 'enabled' : 'disabled'}`)

        // Reinitialize the feature if it's being enabled
        if (enabled) {
          const initMethod =
            `init${feature.charAt(0).toUpperCase() + feature.slice(1)}` as keyof typeof DevHelper
          if (typeof this[initMethod] === 'function') {
            ;(this[initMethod] as () => void)()
          }
        }
      }
    },
    initNetworkErrorClassifier() {
      if (!this.features.networkErrorClassifier) return

      const errorCategories = {
        timeout: ['ECONNABORTED'],
        serverError: ['500', '501', '502', '503', '504', '505'],
        clientError: [
          '400',
          '401',
          '403',
          '404',
          '405',
          '406',
          '407',
          '408',
          '409',
          '410',
          '411',
          '412',
          '413',
          '414',
          '415',
        ],
        networkError: [
          'ECONNRESET',
          'ENOTFOUND',
          'ESOCKETTIMEDOUT',
          'ETIMEDOUT',
          'ECONNREFUSED',
          'EHOSTUNREACH',
          'EPIPE',
          'EAI_AGAIN',
        ],
      }

      nuxtApp.hook('app:error', (error) => {
        let category = 'unknown'
        const errorCode = error.statusCode?.toString() || error.name

        for (const [key, codes] of Object.entries(errorCategories)) {
          if (codes.includes(errorCode)) {
            category = key
            break
          }
        }

        logger.error(`🌐 Network Error (${category}):`, {
          message: error.message,
          code: errorCode,
          stack: error.stack,
        })
      })

      logger.info('🌐 Network Error Classifier initialized')
    },

    initInfiniteLoopDetector() {
      if (!this.features.infiniteLoopDetector) return
      if (!import.meta.client) return

      const MAX_ITERATIONS = 1000000
      const TIME_THRESHOLD = 100 // ms

      const originalSetTimeout = window.setTimeout
      window.setTimeout = function (
        this: typeof window,
        handler: TimerHandler,
        timeout?: number,
        ...args: any[]
      ): number {
        const start = Date.now()
        let iterationCount = 0

        const wrappedCallback = function (this: typeof window) {
          iterationCount++
          if (
            iterationCount > MAX_ITERATIONS ||
            (Date.now() - start > TIME_THRESHOLD && iterationCount > 1000)
          ) {
            logger.warn('🔄 Potential infinite loop detected:', {
              iterations: iterationCount,
              time: Date.now() - start,
              stack: new Error().stack,
            })
          }
          if (typeof handler === 'function') {
            return handler.apply(this, args)
          } else {
            return Function(handler as string).apply(this, args)
          }
        }

        return Number(originalSetTimeout.call(this, wrappedCallback, timeout))
      }

      logger.info('🔄 Infinite Loop Detector initialized')
    },

    initUnhandledPromiseRejectionTracker() {
      if (!this.features.unhandledPromiseRejectionTracker) return
      if (!import.meta.client) return

      window.addEventListener('unhandledrejection', (event) => {
        logger.error('💥 Unhandled Promise Rejection:', {
          reason: event.reason,
          stack: event.reason.stack || new Error().stack,
          event: event,
        })
      })

      logger.info('💥 Unhandled Promise Rejection Tracker initialized')
    },

    checkEnvironmentConsistency() {
      if (!this.features.environmentConsistencyChecker) return

      const requiredVars = []
      const missingVars = requiredVars.filter((varName) => !config.public[varName])

      if (missingVars.length > 0) {
        logger.warn(`🔑 Missing required environment variables: ${missingVars.join(', ')}`)
      } else {
        logger.info('🔑 All required environment variables are set')
      }
    },
  }

  if (import.meta.dev && devHelperConfig.enabled) {
    logger.info('🛠️ DevHelper: Initializing...')
    try {
      DevHelper.initNetworkErrorClassifier()
      DevHelper.initInfiniteLoopDetector()
      DevHelper.initUnhandledPromiseRejectionTracker()
      DevHelper.checkEnvironmentConsistency()
      logger.info('Initialization complete')
    } catch (error) {
      logger.error('Initialization failed:', { error })
    }
  } else {
    logger.info('Initialization skipped (not in dev mode or devHelper not enabled)')
  }

  return {
    provide: {
      devHelper: DevHelper,
    },
  }
})
