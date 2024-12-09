// server/api/ads/active.ts

import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client.rpc('get_active_ads')

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching active ads',
    })
  }

  return { data }
})
