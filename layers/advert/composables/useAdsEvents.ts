// composables/useAdsEvents.ts
export const useAdsEvents = () => {
  const isVisible = ref<boolean>(false)
  const startTime = ref(0)

  const onVisibilityChange = (
    isIntersecting: boolean,
    variantId: string,
    trackInteraction: Function,
  ) => {
    if (isIntersecting && !isVisible.value) {
      isVisible.value = true
      startTime.value = Date.now()
      trackInteraction(variantId, 'view')
    } else if (!isIntersecting && isVisible.value) {
      isVisible.value = false
      if (startTime.value > 0) {
        const engagementTime = (Date.now() - startTime.value) / 1000
        trackInteraction(variantId, 'view', engagementTime)
        startTime.value = 0
      }
    }
  }

  return {
    isVisible,
    startTime,
    onVisibilityChange,
  }
}
