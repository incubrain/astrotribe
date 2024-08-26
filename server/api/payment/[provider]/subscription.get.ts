import { useRuntimeConfig } from '#imports'
import { generateServerToken } from '~/server/utils/generateServerToken'

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const config = useRuntimeConfig().public

  let backendUrl = config.scraperUrl
  if (provider === 'razorpay') {
    backendUrl.concat('/api/customer/subscription')
  } else if (provider === 'stripe') {
    backendUrl.concat('/api/customer/subscription')
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payment provider'
    })
  }

  const token = generateServerToken()

  try {
    const response = await $fetch(backendUrl, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response
  } catch (error) {
    console.error(`Error fetching subscription from ${provider}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to fetch subscription from ${provider}`
    })
  }
})
