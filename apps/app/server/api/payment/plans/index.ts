import { serverSupabaseClient } from '#supabase/server'

// Fetch all plans
export default defineEventHandler(async (event) => {
  const { apiURL } = useRuntimeConfig().public
  const supabase = await serverSupabaseClient(event)

  console.log(apiURL, 'API URL')

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.access_token) {
      throw new Error('No authentication session found')
    }

    const response = await $fetch(`${apiURL}/v1/payments/plans`, {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    })

    if (response?.items!) {
      return response.items
    }
  } catch (error: any) {
    console.error('Get Plans', error)
    return error
  }
})
