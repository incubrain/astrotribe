// server/api/ads/track.post.ts
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { variantId, type, engagementTime = null } = body
  const client = serverSupabaseServiceRole(event)

  const today = new Date().toISOString().split('T')[0]

  // Get current metrics for calculating CTR
  const { data: currentMetrics } = await client
    .from('ad_daily_metrics')
    .select('views, clicks')
    .eq('variant_id', variantId)
    .eq('date', today)
    .single()

  // Calculate new CTR
  let newCtr = null
  if (currentMetrics) {
    const totalViews = currentMetrics.views + (type === 'view' ? 1 : 0)
    const totalClicks = currentMetrics.clicks + (type === 'click' ? 1 : 0)
    newCtr = totalViews > 0 ? (totalClicks / totalViews) * 100 : 0
  }

  // Update daily metrics
  const { error: metricsError } = await client.from('ad_daily_metrics').upsert(
    {
      variant_id: variantId,
      date: today,
      [type === 'view' ? 'views' : 'clicks']: 1,
    },
    {
      onConflict: 'variant_id,date',
      count: type === 'view' ? 'views' : 'clicks',
    },
  )

  // Update variant performance metrics
  if (type === 'view' && engagementTime) {
    const { error: variantError } = await client
      .from('ad_variants')
      .update({
        performance_metrics: {
          avgEngagementTime: engagementTime,
          ctr: newCtr,
          // bounceRate will be calculated separately in analytics
        },
      })
      .eq('id', variantId)

    if (variantError) {
      console.error('Error updating variant metrics:', variantError)
    }
  }

  if (metricsError) {
    throw createError({
      statusCode: 500,
      message: 'Error tracking ad metric',
    })
  }

  return { success: true }
})
