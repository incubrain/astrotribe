import { serverSupabaseServiceRole } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const supabase = serverSupabaseServiceRole(event)
  const body = await readBody(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      message: 'Missing request body',
    })
  }

  const {
    referrer_code,
    visitor_id,
    user_agent,
    ip_address,
    landing_page,
    utm_source,
    utm_medium,
    utm_campaign,
    device_type,
    browser,
    status,
  } = body

  console.log('Capturing referral', visitor_id, referrer_code, body)
  try {
    const { data: existingReferral } = await supabase
      .from('referrals')
      .select('id')
      .eq('visitor_id', visitor_id)
      .single()

    if (existingReferral) {
      return { message: 'Referral already exists for this visitor' }
    }

    const { error } = await supabase.from('referrals').insert({
      referrer_code,
      visitor_id,
      user_agent,
      ip_address,
      landing_page,
      utm_source,
      utm_medium,
      utm_campaign,
      device_type,
      browser,
      status,
    })

    if (error) {
      console.error('Failed to insert referral', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to insert referral',
        cause: error,
      })
    }

    return { message: 'Referral captured successfully' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }
})
