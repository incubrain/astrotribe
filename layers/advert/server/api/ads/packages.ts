// server/api/ads/packages.ts
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = serverSupabaseServiceRole(event)

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
