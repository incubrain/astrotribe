import { defineEventHandler, getQuery } from 'h3'
import { useInstagramAnalytics, useServerError } from '#imports'

const PREFIX = 'social/instagram/insights'

export default defineEventHandler(async (event) => {
  const log = useServerLogger(PREFIX)
  const errors = useServerError(PREFIX)

  const { userId } = getQuery(event) as { userId: string }

  log.info(`userId: ${userId}`)

  try {
    const instagram = useInstagramAnalytics()
    const businessAnalytics = await instagram.fetchBusinessAnalytics(userId)

    log.info(businessAnalytics)

    return {
      status: 200,
      message: 'Profile businessAnalytics returned from Instagram',
      data: businessAnalytics
    }
  } catch (error: any) {
    errors.handleError({
      error,
      devMessage: 'Error fetching Instagram insights',
      userMessage: 'Error fetching Instagram insights'
    })
  }
})
