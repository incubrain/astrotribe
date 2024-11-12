import { defineEventHandler, getQuery } from 'h3'
import { useErrorHandler, useLoggerAsync } from '@ib/logger'
import { useTwitterAnalytics } from '#imports'

const PREFIX = 'social/twitter/analytics'

export default defineEventHandler(async (event) => {
  const log = await useLoggerAsync(PREFIX)
  const errors = useErrorHandler(PREFIX)

  const { postId } = getQuery(event) as { postId: string }

  log.info(`postId: ${postId}`)

  try {
    const twitter = useTwitterAnalytics(postId)
    const userAnalytics = await twitter.fetchUserProfile()
    log.info(userAnalytics)

    return {
      status: 200,
      message: 'Post analytics returned from Twitter',
      data: userAnalytics,
    }
  } catch (error: any) {
    errors.handleError({
      error,
      devMessage: 'Error fetching Twitter analytics',
      userMessage: 'Error fetching Twitter analytics',
    })
  }
})
