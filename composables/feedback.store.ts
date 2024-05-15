export const useFeedbackStore = defineStore('feedbackStore', () => {
  const { fetch } = useBaseFetch()
  const storeKey = 'feedbacks'
  const logger = useLogger(storeKey)
  const loading = useLoadingStore()
  const toast = useToast()

  async function submitFeedback(newFeedback: any) {
    console.log('newFeedback', newFeedback)

    if (loading.isLoading(storeKey)) {
      return null
    }

    loading.setLoading(storeKey, true)

    try {
      const response = await fetch('/api/feedback/insert/single', {
        method: 'POST',
        body: newFeedback
      })

      toast.add({ severity: 'info', summary: response.message })
    } catch (error) {
      logger.error('Error submitting question and handling response:', error)
    } finally {
      await loading.setLoadingInterval(storeKey, false, 1000)
    }
  }

  return {
    submitFeedback
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFeedbackStore, import.meta.hot))
}
