import { defineNuxtPlugin } from '#app'

interface PosthogEvent {
  name: string
  properties?: Record<string, any>
}

const AUTH_EVENTS = {
  LOGIN_ATTEMPT: 'login_attempt',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_ERROR: 'login_error',
  SIGNUP_ATTEMPT: 'signup_attempt',
  SIGNUP_SUCCESS: 'signup_success',
  SIGNUP_ERROR: 'signup_error',
  MAGIC_LINK_ATTEMPT: 'magic_link_attempt',
  MAGIC_LINK_SENT: 'magic_link_sent',
  MAGIC_LINK_ERROR: 'magic_link_error',
  PASSWORD_RESET_REQUEST: 'password_reset_request',
  PASSWORD_RESET_SUCCESS: 'password_reset_success',
  PASSWORD_RESET_ERROR: 'password_reset_error',
  PASSWORD_UPDATE_SUCCESS: 'password_update_success',
  PASSWORD_UPDATE_ERROR: 'password_update_error',
  LOGOUT_SUCCESS: 'logout_success',
}

// Queue to store events before Posthog loads
const eventQueue: PosthogEvent[] = []

export default defineNuxtPlugin(() => {
  const { public: env } = useRuntimeConfig()
  const logger = useLogger('analytics')

  // Function to process queued events
  function processQueue() {
    if (!window.posthog) return

    while (eventQueue.length > 0) {
      const event = eventQueue.shift()
      if (event) {
        window.posthog.capture(event.name, event.properties)
      }
    }
  }

  // Initialize PostHog if available
  if (import.meta.client && env.posthogKey) {
    // Check if PostHog is already loaded
    if (!window.posthog) {
      // Load PostHog script
      const script = document.createElement('script')
      script.src = 'https://cdn.posthog.com/static/array.js'
      script.async = true
      script.onload = () => {
        if (window.posthog) {
          window.posthog.init(env.posthogKey, {
            api_host: env.posthogURL || 'https://app.posthog.com',
            loaded: processQueue,
          })
        }
      }
      document.head.appendChild(script)
    } else {
      // If already loaded, process queue
      processQueue()
    }
  }

  // Function to track events, queue them if PostHog isn't loaded yet
  function trackEvent(name: string, properties: Record<string, any> = {}) {
    if (import.meta.client) {
      // Add event to queue
      eventQueue.push({ name, properties })

      // If PostHog is loaded, process the queue immediately
      if (window.posthog) {
        processQueue()
      }

      // Debug logging in development
      if (import.meta.dev) {
        logger.debug('Track Event', { name, properties })
      }
    }
  }

  return {
    provide: {
      analyticsEvents: AUTH_EVENTS,
      trackAuthEvent: trackEvent,
    },
  }
})

// Add type definitions
declare global {
  interface Window {
    posthog?: {
      init: (apiKey: string, options: Record<string, any>) => void
      capture: (eventName: string, properties?: Record<string, any>) => void
      identify: (userId: string, properties?: Record<string, any>) => void
    }
  }
}
