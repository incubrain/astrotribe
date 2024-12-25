import { getActivePinia } from 'pinia'

interface DemockerConfig {
  mode: 'light' | 'medium' | 'chaos'
  protectedFields?: string[]
  targetFields?: string[]
  enabled: boolean
}

export const demockerConfig: Record<string, DemockerConfig> = {
  // Referral dashboard config
  '/admin/referrals': {
    mode: 'medium',
    protectedFields: ['id', 'userId', 'referralCode'],
    targetFields: ['metrics.deviceBreakdown', 'metrics.countryBreakdown', 'metrics.topPerformers'],
    enabled: true,
  },

  // User dashboard config
  '/dashboard': {
    mode: 'light',
    protectedFields: ['id', 'email', 'accountStatus'],
    targetFields: ['userMetrics', 'recentActivity', 'notifications'],
    enabled: true,
  },

  // target specific components by name
  'ReferralSecurityMonitoring': {
    mode: 'chaos',
    protectedFields: ['alertId', 'severity'],
    targetFields: ['alerts', 'threatMetrics', 'riskScores'],
    enabled: true,
  },
}

interface ErrorLog {
  timestamp: Date
  error: Error
  path: string
  originalValue: any
  modifiedValue: any
  action: string
}

declare global {
  interface Window {
    Vue?: {
      config: {
        errorHandler: (error: Error, vm: any, info: string) => void
      }
    }
  }
}

class Democker {
  private config: DemockerConfig = {
    mode: 'medium',
    protectedFields: [],
    targetFields: [],
    enabled: true,
  }

  private modes = {
    light: { nullProb: 0.1, omitProb: 0.1 },
    medium: { nullProb: 0.3, omitProb: 0.2 },
    chaos: { nullProb: 0.5, omitProb: 0.4 },
  }

  private errorLog: ErrorLog[] = []

  constructor(config: Partial<DemockerConfig> = {}) {
    this.config = { ...this.config, ...config }
    this.setupErrorMonitoring()
  }

  private setupErrorMonitoring() {
    if (import.meta.client) {
      // Track runtime errors
      window.onerror = (msg, url, line, col, error) => {
        this.logError(error || new Error(msg as string), 'runtime')
        return false // Let other error handlers run
      }

      // Track promise rejections
      window.onunhandledrejection = (event) => {
        this.logError(event.reason, 'promise')
        return false
      }

      // Track Vue errors if available
      if (window.Vue) {
        window.Vue.config.errorHandler = (error, vm, info) => {
          this.logError(error, 'vue', info)
        }
      }
    }
  }

  private logError(error: Error, type: string, info?: string) {
    const errorLog: ErrorLog = {
      timestamp: new Date(),
      error,
      path: this.currentPath || 'unknown',
      originalValue: this.currentOriginal,
      modifiedValue: this.currentModified,
      action: `${type}${info ? `: ${info}` : ''}`,
    }

    this.errorLog.push(errorLog)
    console.warn('Democker caught error:', errorLog)
  }

  private currentPath: string = ''
  private currentOriginal: any = null
  private currentModified: any = null

  demock(data: any, path: string = ''): any {
    if (!this.config.enabled) return data
    if (!data || typeof data !== 'object') return data

    const { nullProb, omitProb } = this.modes[this.config.mode]
    const result = Array.isArray(data) ? [] : {}

    for (const [key, value] of Object.entries(data)) {
      const fullPath = path ? `${path}.${key}` : key

      // Skip protected fields
      if (this.config.protectedFields?.includes(fullPath)) {
        result[key] = value
        continue
      }

      // Only process target fields if specified
      if (
        this.config.targetFields?.length &&
        !this.config.targetFields.some((field) => fullPath.startsWith(field))
      ) {
        result[key] = value
        continue
      }

      try {
        this.currentPath = fullPath
        this.currentOriginal = value

        // Randomly modify data
        if (Math.random() < nullProb) {
          this.currentModified = null
          result[key] = null
        } else if (Math.random() < omitProb) {
          this.currentModified = undefined
          continue
        } else if (value && typeof value === 'object') {
          this.currentModified = this.demock(value, fullPath)
          result[key] = this.currentModified
        } else {
          this.currentModified = value
          result[key] = value
        }
      } catch (error: any) {
        this.logError(error as Error, 'democking')
        result[key] = value
      }
    }

    return result
  }

  configure(newConfig: Partial<DemockerConfig>) {
    this.config = { ...this.config, ...newConfig }
  }

  getErrorLog() {
    return this.errorLog
  }

  clearErrorLog() {
    this.errorLog = []
  }

  isEnabled(): boolean {
    return this.config.enabled || false
  }

  getConfig(): DemockerConfig {
    return { ...this.config }
  }
}

// Create plugin
export default defineNuxtPlugin((nuxtApp) => {
  // Only run in development
  if (!import.meta) return

  const democker = new Democker({
    mode: 'medium',
    protectedFields: ['id', 'userId'], // Common protected fields
    enabled: true,
  })

  // Add to window for console access
  if (import.meta.client) {
    window.$democker = democker
  }

  const pinia = getActivePinia()

  if (pinia) {
    const originalSubscribe = pinia.use

    // Override the subscribe function
    pinia.use = (fn) => {
      originalSubscribe.call(pinia, (context) => {
        // Call original plugin
        fn(context)

        // Add our democker modifications
        const { store } = context

        // Create proxied actions
        const originalActions = { ...store.actions }

        Object.keys(originalActions).forEach((actionName) => {
          if (actionName.startsWith('fetch') || actionName.startsWith('get')) {
            const originalAction = store[actionName]

            store[actionName] = async function (...args) {
              const result = await originalAction.apply(this, args)

              // 30% chance to modify data when democker is enabled
              if (democker.isEnabled() && Math.random() < 0.3) {
                return democker.demock(result, `${store.$id}.${actionName}`)
              }

              return result
            }
          }
        })
      })
    }
  }

  return {
    provide: {
      democker,
    },
  }
})
