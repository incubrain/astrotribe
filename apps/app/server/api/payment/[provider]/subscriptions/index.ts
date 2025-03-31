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

    const { data, meta, success } = await $fetch(`${apiURL}/api/v1/payments/subscriptions`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (!success) {
      console.error('Get Subscriptions', meta)
      throw new Error('Could not get subscriptions')
    }

    return data
  } catch (error: any) {
    console.error('Get Subscriptions', error)
    return error
  }
})
