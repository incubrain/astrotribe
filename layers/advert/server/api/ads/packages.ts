// server/api/ads/packages.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data, error } = await client
    .from('ad_packages')
    .select('*')
    .eq('active', true)
    .order('name')

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching ad packages',
    })
  }

  return { data }
})
