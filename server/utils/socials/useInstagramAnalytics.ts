import { useServerError } from '#imports'


const INSTAGRAM_API_URL = 'https://graph.instagram.com'
const ACCESS_TOKEN = 'YOUR_INSTAGRAM_ACCESS_TOKEN'
const PREFIX = 'useInstagramAnalytics'

export function useInstagramAnalytics() {
  const log = useServerLogger(PREFIX)
  const errors = useServerError(PREFIX)

  async function fetchProfileStatistics(userId: string) {
    log.info(`Fetching instagram profile statistics for: ${userId}`)
    const url = `${INSTAGRAM_API_URL}/${userId}?fields=id,username,media_count,followers_count,follows_count&access_token=${ACCESS_TOKEN}`
    const response = await $fetch(url)
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch profile statistics for ${userId}`,
      userMessage: `Failed to fetch statistics for profile ${userId}`
    })
    return data
  }

  async function fetchBusinessAnalytics(username: string) {
    const url = `${INSTAGRAM_API_URL}/${userId}?fields=business_discovery.username(${username}){followers_count,media_count,media{comments_count,like_count}}&access_token=${ACCESS_TOKEN}`
    const response = await $fetch(url, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`
      }
    })
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch business analytics for ${username}`,
      userMessage: `Failed to fetch analytics for ${username}`
    })
    return {
      followers_count: data.business_discovery.followers_count,
      media_count: data.business_discovery.media_count,
      media: data.business_discovery.media.data.map((mediaItem: any) => ({
        id: mediaItem.id,
        comments_count: mediaItem.comments_count,
        like_count: mediaItem.like_count
      }))
    }
  }

  return {
    fetchProfileStatistics,
    fetchBusinessAnalytics
  }
}
