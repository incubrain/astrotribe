import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { paymentId, subscriptionId } = await readBody(event)

  const { apiURL } = useRuntimeConfig().public
  const supabase = await serverSupabaseClient(event)

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No authentication session found')
    }

    const response = await $fetch(
      `${apiURL}/v1/payments/subscriptions/${subscriptionId}/${paymentId}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      },
    )

    return response
  } catch (error: any) {
    console.error('Failed to create subscription', error)
    return error
  }
})
