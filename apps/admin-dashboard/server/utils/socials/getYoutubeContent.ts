import { useServerError } from '#imports'

interface YouTubeVideo {
  title: string
  description: string
  publishedAt: string
  videoId: string
}

interface YouTubeProfile {
  name: string
  description: string
  subscriberCount: number
  videos: YouTubeVideo[]
}

const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3/'
const GOOGLE_API_KEY = useRuntimeConfig().googleApiKey

export async function getYoutubeContent(username: string): Promise<YouTubeProfile | null> {
  try {
    // Fetch the channel details by username
    const channelResponse = await $fetch(`${YOUTUBE_API_URL}channels`, {
      params: {
        forHandle: username,
        part: 'snippet,contentDetails,statistics',
        key: GOOGLE_API_KEY,
      },
    })

    console.log('channelRes', channelResponse)

    if (channelResponse.items.length === 0) {
      return null
      // No channel found
    }

    const channel = channelResponse.items[0]
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads

    // Fetch the latest videos from the uploads playlist
    const videosResponse = await $fetch(`${YOUTUBE_API_URL}playlistItems`, {
      params: {
        part: 'id,snippet,contentDetails',
        maxResults: 12,
        playlistId: uploadsPlaylistId,
        key: GOOGLE_API_KEY,
      },
    })

    const videos = videosResponse.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      videoId: item.contentDetails.videoId,
    }))

    console.log('videos', videos)

    return {
      name: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: channel.statistics.subscriberCount,
      videos,
    }
  } catch (error) {
    console.error('Failed to fetch YouTube profile details:', error)
    return null
  }
}

export function useYoutubeChannel(channelId: string) {
  const errors = useServerError('getYoutubeChannelAnalytics')

  async function fetchChannelStatistics() {
    const url = `${YOUTUBE_API_URL}channels?part=statistics&id=${channelId}&key=${GOOGLE_API_KEY}`
    const response = await $fetch(url)
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch channel statistics for ${channelId}`,
      userMessage: `Failed to fetch statistics for channel ${channelId}`,
    })
    return data.items[0].statistics
  }

  async function fetchChannelVideos() {
    const url = `${YOUTUBE_API_URL}search?key=${GOOGLE_API_KEY}&channelId=${channelId}&part=snippet,id&order=date&maxResults=5`
    const response = await $fetch(url)
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch channel videos for ${channelId}`,
      userMessage: `Failed to fetch videos for channel ${channelId}`,
    })

    return data.items
  }

  async function fetchVideoStatistics(videoId: string) {
    const url = `${YOUTUBE_API_URL}videos?part=statistics&id=${videoId}&key=${GOOGLE_API_KEY}`
    const response = await $fetch(url)
    const data = errors.handleFetchError({
      response,
      devMessage: `Failed to fetch video statistics for ${channelId}`,
      userMessage: `Failed to fetch video statistics for channel ${channelId}`,
    })
    return data.items[0].statistics
  }

  return {
    fetchChannelStatistics,
    fetchChannelVideos,
    fetchVideoStatistics,
  }
}
