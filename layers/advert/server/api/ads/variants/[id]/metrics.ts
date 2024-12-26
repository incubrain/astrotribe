// /api/ads/variants/[id]/metrics.ts
import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const adId = event.context.params?.id
  const client = serverSupabaseServiceRole(event)

  console.log('Fetching variant metrics for ad:', adId)
  const { data, error } = await client.rpc('get_ad_variant_metrics', {
    ad_uuid: adId,
  })

  console.log('Variant metrics:', data, error)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Error fetching variant metrics',
    })
  }

  return { data }
})
