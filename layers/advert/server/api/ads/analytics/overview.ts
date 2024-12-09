// server/api/ads/analytics/overview.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { period = '30' } = getQuery(event)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - Number(period))

  const { data, error } = await client.rpc('get_ad_analytics', {
    start_date: startDate.toISOString(),
  })

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching analytics overview',
    })
  }

  return { data }
})
