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

  const { visitor_id, referrer_code, conversion_value } = body

  console.log('Converting referral', visitor_id, referrer_code, conversion_value)

  try {
    const { error } = await supabase
      .from('referrals')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString(),
        conversion_value: conversion_value || null,
      })
      .eq('visitor_id', visitor_id)
      .eq('referrer_code', referrer_code)

    if (error) {
      console.log('Failed to mark as converted', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to mark as converted',
      })
    }

    return { message: 'Referral marked as converted' }
  } catch (error) {
    throw createError({
      statusCode: 500,
      message: error.message,
    })
  }
})
