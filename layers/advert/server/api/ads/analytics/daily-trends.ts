// server/api/ads/analytics/daily-trends.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const { period = '300', adId } = getQuery(event)

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - Number(period))

  console.log('Fetching daily trends for ad:', adId, 'from:', startDate)
  const { data, error } = await client.rpc('get_ad_daily_trends', {
    ad_uuid: adId,
    start_date: startDate.toISOString(),
  })

  console.log('Daily trends:', data, error)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching daily trends',
    })
  }

  return { data }
})
