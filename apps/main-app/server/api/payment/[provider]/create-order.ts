// server/api/payment/[provider]/create-order.post.ts
import { useRuntimeConfig } from '#imports'
import { generateServerToken } from '~/server/utils/generateServerToken'

export default defineEventHandler(async (event) => {
  const provider = getRouterParam(event, 'provider')
  const body = await readBody(event)
  const config = useRuntimeConfig().public

  console.log('provider:', provider)

  let backendUrl = config.scraperUrl
  if (provider === 'razorpay') {
    console.log('provider is razorpay')
    backendUrl = backendUrl.concat('/api/customer/subscription/create')
  } else if (provider === 'stripe') {
    backendUrl = backendUrl.concat('/api/customer/subscription/create')
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid payment provider',
    })
  }

  console.log('backendUrl:', backendUrl)

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
    console.error(`Error creating order with ${provider}:`, error)
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to create order with ${provider}`,
    })
  }
})
