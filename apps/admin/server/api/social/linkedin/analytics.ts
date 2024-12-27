import { useLinkedinAnalytics } from '#imports'

const PREFIX = 'social/linkedin/analytics'

export default defineEventHandler(async (event) => {
  const logger = useServerLogger(PREFIX)

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
    logger.error('Error fetching LinkedIn analytics', {
      error,
      userMessage: 'Error fetching LinkedIn analytics',
    })
  }
})
