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

export async function getYoutubeContent(username: string): Promise<YouTubeProfile | null> {
  const apiKey = useRuntimeConfig().googleApiKey
  1
  try {
    // Fetch the channel details by username
    const channelResponse = await $fetch(`https://www.googleapis.com/youtube/v3/channels`, {
      params: {
        forHandle: username,
        part: 'snippet,contentDetails,statistics',
        key: apiKey
      }
    })

    console.log('channelRes', channelResponse)

    if (channelResponse.items.length === 0) {
      return null
      // No channel found
    }

    const channel = channelResponse.items[0]
    const uploadsPlaylistId = channel.contentDetails.relatedPlaylists.uploads

    // Fetch the latest videos from the uploads playlist
    const videosResponse = await $fetch(`https://www.googleapis.com/youtube/v3/playlistItems`, {
      params: {
        part: 'id,snippet,contentDetails',
        maxResults: 12,
        playlistId: uploadsPlaylistId,
        key: apiKey
      }
    })

    const videos = videosResponse.items.map((item: any) => ({
      title: item.snippet.title,
      description: item.snippet.description,
      publishedAt: item.snippet.publishedAt,
      videoId: item.contentDetails.videoId
    }))

    console.log('videos', videos)

    return {
      name: channel.snippet.title,
      description: channel.snippet.description,
      subscriberCount: channel.statistics.subscriberCount,
      videos
    }
  } catch (error) {
    console.error('Failed to fetch YouTube profile details:', error)
    return null
  }
}

// This function can now be called within your server routes or API routes in Nuxt.
