import { useErrorHandler, useLoggerAsync } from '@ib/logger'
import { useLinkedinAnalytics } from '#imports'

const PREFIX = 'social/linkedin/analytics'

export default defineEventHandler(async (event) => {
  const log = await useLoggerAsync(PREFIX)
  const errors = useErrorHandler(PREFIX)

  const { postId } = getQuery(event) as { postId: string }

  log.info(`postId: ${postId}`)

  try {
    const linkedin = useLinkedinAnalytics(postId)
    const postAnalytics = await linkedin.fetchPostAnalytics()
    log.info(postAnalytics)

    return {
      status: 200,
      message: 'Post analytics returned from LinkedIn',
      data: postAnalytics,
    }
  } catch (error: any) {
    errors.handleError({
      error,
      devMessage: 'Error fetching LinkedIn analytics',
      userMessage: 'Error fetching LinkedIn analytics',
    })
  }
})
