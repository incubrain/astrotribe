export const usePopup = (trackingId: string) => {
  const { trackEvent } = usePopupTracking()
  const isVisible = ref(false)
  const timeoutId: NodeJS.Timeout | null = null

  const show = async () => {
    if (!trackingId) {
      console.warn('No tracking ID available for popup')
      return
    }

    try {
      isVisible.value = true
      await handleView()
    } catch (error: any) {
      console.error('Error showing popup:', error)
    }
  }

  const hide = () => {
    isVisible.value = false
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }

  const handleView = async () => {
    if (trackingId) {
      await trackEvent(trackingId, 'view')
    }
  }

  const handleClick = async () => {
    if (trackingId) {
      await trackEvent(trackingId, 'click')
    }
  }

  const handleDismiss = async () => {
    if (trackingId) {
      await trackEvent(trackingId, 'dismiss')
    }
    hide()
  }

  onBeforeUnmount(() => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  })

  return {
    isVisible,
    show,
    hide,
    handleClick,
    handleDismiss,
  }
}
