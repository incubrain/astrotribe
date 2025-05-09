import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const { apiURL } = useRuntimeConfig().public
  const supabase = await serverSupabaseClient(event)

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No authentication session found')
    }

    const response = await $fetch(`${apiURL}/v1/payments/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (response?.items) return response.items
  } catch (error: any) {
    console.error('Get Subscriptions', error)
    return error
  }
})
