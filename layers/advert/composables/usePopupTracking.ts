export const usePopupTracking = () => {
  const { trackInteraction } = useAdsStore()
  const startTime = ref<number>(0)

  const trackEvent = async (id: string, type: 'view' | 'click' | 'dismiss') => {
    try {
      const now = Date.now()
      const engagementTime = startTime.value ? (now - startTime.value) / 1000 : 0

      // Only track if we have a valid ID
      if (id) {
        await trackInteraction(id, type, engagementTime)
      }

      // Reset start time for view events
      if (type === 'view') {
        startTime.value = now
      }
    } catch (error: any) {
      console.error('Error tracking popup event:', error)
    }
  }

  return {
    trackEvent,
    resetTracking: () => {
      startTime.value = 0
    },
  }
}
