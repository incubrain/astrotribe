import { useYoutubeChannel } from '#imports'

const PREFIX = 'social/youtube/analytics'

export default defineEventHandler(async (event) => {
  const logger = useServerLogger(PREFIX)

  const { channelName } = getQuery(event) as { channelName: string }

  logger.info(`Fetching YouTube analytics for channel: ${channelName}`)

  try {
    const youtube = useYoutubeChannel(channelName)

    const channelStatistics = await youtube.fetchChannelStatistics()
    logger.info('Channel statistics fetched', { data: channelStatistics })

    const videoItems = await youtube.fetchChannelVideos()
    logger.info('Channel videos fetched', { count: videoItems.length })

    const videoStatsPromises = videoItems.map(async (video: any) => {
      const stats = await youtube.fetchVideoStatistics(video.id.videoId)
      logger.info('Video statistics fetched', {
        videoId: video.id.videoId,
        stats,
      })
      return { ...video, statistics: stats }
    })

    const videos = await Promise.all(videoStatsPromises)

    logger.info('Successfully processed all videos', {
      channelName,
      videoCount: videos.length,
    })

    return {
      status: 200,
      message: 'Videos returned from youtube',
      data: {
        channelStatistics,
        videos,
      },
    }
  } catch (error: any) {
    // The centralized logger will automatically handle storing the error
    logger.error('Failed to fetch YouTube analytics', {
      type: 'API_ERROR',
      context: {
        channelName,
        action: 'fetchYoutubeAnalytics',
        component: 'YouTubeService',
      },
      error: {
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
    })

    // Still throw an appropriate error for the API response
    throw createError({
      statusCode: error.status || 500,
      statusMessage: 'Failed to fetch YouTube analytics',
      message: 'An error occurred while fetching YouTube analytics',
    })
  }
})
