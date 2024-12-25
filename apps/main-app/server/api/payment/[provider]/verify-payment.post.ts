// server/api/payment/[provider]/verify-payment.post.ts
import { useRuntimeConfig } from '#imports'
import { generateServerToken } from '~/server/utils/generateServerToken'

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const body = await readBody(event)
  const config = useRuntimeConfig().public

  const backendUrl = config.scraperUrl
  if (provider === 'razorpay') {
    backendUrl.concat('/api/customer/subscription/verify-payment')
  } else if (provider === 'stripe') {
    backendUrl.concat('/api/customer/subscription/verify-payment')
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payment provider',
    })
  }

  const token = generateServerToken()

  try {
    const response = await $fetch(backendUrl, {
      method: 'POST',
      body,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response
  } catch (error: any) {
    console.error(`Error verifying payment with ${provider}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to verify payment with ${provider}`,
    })
  }
})
