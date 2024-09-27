import { useServerError } from '../../../../../../layers/base/server/utils/base.error-handler'
import { useYoutubeChannel } from '#imports'

const PREFIX = 'social/youtube/analytics'

export default defineEventHandler(async (event) => {
  const log = useServerLogger(PREFIX)
  const errors = useServerError(PREFIX)

  const { channelName } = getQuery(event) as { channelName: string }

  log.info(`channelName: ${channelName}`)

  try {
    const youtube = useYoutubeChannel(channelName)
    const channelStatistics = await youtube.fetchChannelStatistics()
    log.info(channelStatistics)
    const videoItems = await youtube.fetchChannelVideos()
    log.info(videoItems)
    const videoStatsPromises = videoItems.map(async (video: any) => {
      const stats = await youtube.fetchVideoStatistics(video.id.videoId)
      log.info(stats)
      return { ...video, statistics: stats }
    })
    const videos = await Promise.all(videoStatsPromises)

    log.info('returning videos')
    return {
      status: 200,
      message: 'Videos returned from youtube',
      data: {
        channelStatistics,
        videos,
      },
    }
  } catch (error: any) {
    errors.handleError({
      error,
      devMessage: 'error fetching youtube analytics',
      userMessage: 'error fetching youtube analytics',
    })
  }
})
