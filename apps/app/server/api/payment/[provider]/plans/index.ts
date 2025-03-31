import { serverSupabaseClient } from '#supabase/server'

// Fetch all plans
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

    const { data, meta, success } = await $fetch(`${apiURL}/api/v1/payments/plans/`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
      query: {
        is_active: true,
      },
    })

    if (!success) {
      console.error('Get Plans', meta)
      throw new Error('Could not get plans')
    }

    return data
  } catch (error: any) {
    console.error('Get Plans', error)
    return error
  }
})
