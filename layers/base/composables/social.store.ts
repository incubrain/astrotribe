export const useSocialStore = defineStore('settingsStore', () => {
  const errors = useBaseError()
  const { fetch } = useBaseFetch()

  const youtube = ref({})
  async function getYoutubeAnalytics(channelName: string) {
    console.info(`getting youtube analytics for ${channelName}`)
    const response = await fetch('/api/social/youtube/analytics', {
      method: 'GET',
      query: {
        channelName,
      },
    })

    const data = errors.server({
      response,
      devOnly: false,
      devMessage: 'error getting youtube analytics',
      userMessage: 'something went wrong when getting youtube analytics',
    })

    youtube.value = data
  }

  const instagram = ref<any>(null)
  async function getInstagramAnalytics(userId: string) {
    console.info(`Fetching Instagram analytics for ${userId}`)
    try {
      const response = await $fetch(`/api/social/instagram/analytics?userId=${userId}`, {
        method: 'GET',
      })

      const data = errors.server({
        response,
        devOnly: false,
        devMessage: 'Error getting Instagram analytics',
        userMessage: 'Something went wrong when getting Instagram analytics',
      })

      instagram.value = data
    } catch (error: any) {
      errors.client({
        error,
        devOnly: false,
        devMessage: 'Error getting Instagram analytics',
        userMessage: 'Something went wrong when getting Instagram analytics',
      })
    }
  }

  const linkedin = ref<any>(null)
  async function getLinkedInAnalytics(postId: string) {
    console.info(`Fetching LinkedIn analytics for post ${postId}`)
    try {
      const response = await $fetch(`/api/social/linkedin/analytics?postId=${postId}`, {
        method: 'GET',
      })

      const data = errors.server({
        response,
        devOnly: false,
        devMessage: 'Error getting LinkedIn analytics',
        userMessage: 'Something went wrong when getting LinkedIn analytics',
      })

      linkedin.value = data
    } catch (error: any) {
      errors.client({
        error,
        devOnly: false,
        devMessage: 'Error getting LinkedIn analytics',
        userMessage: 'Something went wrong when getting LinkedIn analytics',
      })
    }
  }

  const twitter = ref<any>(null)
  async function getTwitterAnalytics(postId: string) {
    console.info(`Fetching Twitter analytics for post ${postId}`)
    try {
      const response = await fetch(`/api/social/twitter/analytics?postId=${postId}`, {
        method: 'GET',
      })

      const data = errors.server({
        response,
        devOnly: false,
        devMessage: 'Error getting Twitter analytics',
        userMessage: 'Something went wrong when getting Twitter analytics',
      })

      twitter.value = data
    } catch (error: any) {
      errors.client({
        error,
        devOnly: false,
        devMessage: 'Error getting Twitter analytics',
        userMessage: 'Something went wrong when getting Twitter analytics',
      })
    }
  }

  return {
    youtube,
    getYoutubeAnalytics,
    //
    instagram,
    getInstagramAnalytics,
    //
    linkedin,
    getLinkedInAnalytics,
    //
    twitter,
    getTwitterAnalytics,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSocialStore, import.meta.hot))
}
