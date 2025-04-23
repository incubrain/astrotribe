import posthog from 'posthog-js'

export default defineNuxtPlugin((nuxtApp) => {
  const env = nuxtApp.$config.public
  const env2 = useRuntimeConfig().public

  const posthogKey = String(env.posthogKey || env2.posthogKey)
  const posthogURL = String(env.posthogURL || env2.posthogURL)

  console.log('PostHog KEYS:', env, env2)

  // Initialize PostHog
  posthog.init(posthogKey, {
    api_host: posthogURL,
    autocapture: false, // Disable autocapture as we'll handle events manually
    capture_pageview: false, // We'll capture pageviews manually for more control
    persistence: 'localStorage+cookie',
    // bootstrap: {
    //   distinctID: runtimeConfig.public.posthogDistinctId // Set this in your runtime config if you have a user ID
    // },
    loaded: (posthog) => {
      // This function is called once PostHog is loaded
      if (import.meta.env.NODE_ENV === 'development') {
        // Log to console in development mode
        posthog.debug()
      }
    },
  })

  // Capture page views
  nuxtApp.hook('page:finish', () => {
    posthog.capture('$pageview')
  })

  // Expose PostHog instance and utility functions
  return {
    provide: {
      posthog: {
        // Expose the raw PostHog instance
        raw: posthog,

        // Utility function to capture events
        capture: (eventName: string, properties?: Record<string, any>) => {
          posthog.capture(eventName, properties)
        },

        // Utility function for A/B testing
        getFeatureFlag: (flagName: string, defaultValue?: any) => {
          return posthog.getFeatureFlag(flagName, defaultValue)
        },

        // Utility function to identify users
        identify: (distinctId: string, properties?: Record<string, any>) => {
          posthog.identify(distinctId, properties)
        },

        // Utility function to reset user identity
        reset: () => {
          posthog.reset()
        },

        // Utility function to opt in/out of tracking
        optIn: () => {
          posthog.opt_in_capturing()
        },
        optOut: () => {
          posthog.opt_out_capturing()
        },

        // Utility function for registering super properties
        register: (properties: Record<string, any>) => {
          posthog.register(properties)
        },

        // Utility function for registering one-time super properties
        registerOnce: (properties: Record<string, any>) => {
          posthog.register_once(properties)
        },
      },
    },
  }
})
