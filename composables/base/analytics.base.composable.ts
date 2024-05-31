export function useAnalytics() {
  const analytics = useNuxtApp().$posthog()

  if (!analytics) {
    return null
  }

  console.log('useAnalytics', analytics)
  return analytics
}
