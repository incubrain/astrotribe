import { posthog } from 'posthog-js'

export default defineNuxtPlugin(() => {
  const pubkey = useRuntimeConfig().public.posthogKey
  if (!pubkey) {
    throw createError({ message: 'posthog key not defined' })
  }
  const posthogClient = posthog.init(pubkey, {
    api_host: 'https://app.posthog.com',
    rageclick: true,
    loaded: (posthog) => {
      if (import.meta.env.MODE === 'development') {
        posthog.debug()
      }
    }
  })

  // Make sure that pageviews are captured with each route change
  const router = useRouter()
  router.afterEach((to) => {
    posthog.capture('$pageview', {
      current_url: to.fullPath
    })
  })

  // Ensure flags are loaded before usage.
  // You'll only need to call this on the code the first time a user visits.
  // See this doc for more details: https://posthog.com/docs/feature-flags/manual#ensuring-flags-are-loaded-before-usage
  // posthog.onFeatureFlags(function() {
  //     // feature flags should be available at this point
  //     if (posthog.getFeatureFlag('experiment-feature-flag-key')  == 'variant-name') {
  //         // do something
  //     }
  // })

  // posthog.getEarlyAccessFeatures((previewItemData) => {
  //     // do something with early access feature
  // })
  // posthog.updateEarlyAccessFeatureEnrollment(flagKey, 'true')

  return {
    provide: {
      posthog: () => posthogClient
    }
  }
})
