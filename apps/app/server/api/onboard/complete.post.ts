import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    console.warn('[Onboard] Unauthorized access attempt')
    throw createError({ statusCode: 401, message: 'Authentication required' })
  }

  const userId = user.id
  const body = await readBody(event)

  console.info('[Onboard] Starting onboarding for user:', userId)
  console.debug('[Onboard] Received data:', JSON.stringify(body, null, 2))

  const { user_type, location, interests = [], topics = [], feature_interests = [] } = body

  try {
    let addressId: string | null = null

    // Step 1: Insert Address
    if (location?.full_address) {
      console.info('[Onboard] Inserting primary address...')
      const { data: addressInsert, error: addressError } = await client
        .from('addresses')
        .insert({
          user_id: userId,
          address_type: 'user',
          is_primary: true,
          name: 'Primary Address',
          full_address: location.full_address,
          address_line1: location.address_line1,
          address_line2: location.address_line2,
          city: location.city,
          state: location.state,
          postal_code: location.postal_code,
          country: location.country,
          country_code: location.country_code,
          latitude: location.latitude,
          longitude: location.longitude,
        })
        .select('id')
        .single()

      if (addressError) {
        console.error('[Onboard] Failed to insert address:', addressError)
        throw addressError
      }

      addressId = addressInsert.id
      console.info('[Onboard] Address inserted with ID:', addressId)
    }

    // Step 2: Update user_profiles
    console.info('[Onboard] Updating user profile...')
    const profileUpdates: any = {
      onboarding_completed: true,
    }
    if (user_type) profileUpdates.user_type = user_type
    if (addressId) profileUpdates.primary_address_id = addressId

    const { error: profileError } = await client
      .from('user_profiles')
      .update(profileUpdates)
      .eq('id', userId)

    if (profileError) {
      console.error('[Onboard] Failed to update user profile:', profileError)
      throw profileError
    }

    console.info('[Onboard] User profile updated')

    // Step 3: Interests
    console.info('[Onboard] Updating user interests...')
    await client.from('user_categories').delete().eq('user_id', userId)
    if (interests.length > 0) {
      const interestRows = interests.map((id: string) => ({
        user_id: userId,
        category_id: id,
      }))
      const { error } = await client.from('user_categories').insert(interestRows)
      if (error) {
        console.error('[Onboard] Failed to insert interests:', error)
        throw error
      }
      console.info('[Onboard] Interests saved')
    }

    // Step 4: Topics
    console.info('[Onboard] Updating user topics...')
    await client.from('user_tags').delete().eq('user_id', userId)
    if (topics.length > 0) {
      const topicRows = topics.map((id: string) => ({
        user_id: userId,
        tag_id: id,
      }))
      const { error } = await client.from('user_tags').insert(topicRows)
      if (error) {
        console.error('[Onboard] Failed to insert topics:', error)
        throw error
      }
      console.info('[Onboard] Topics saved')
    }

    // Step 5: Feature Interests
    console.info('[Onboard] Updating user feature interests...')
    await client.from('user_features').delete().eq('user_id', userId)
    if (feature_interests.length > 0) {
      const featureRows = feature_interests.map((id: string) => ({
        user_id: userId,
        feature_id: id,
      }))
      const { error } = await client.from('user_features').insert(featureRows)
      if (error) {
        console.error('[Onboard] Failed to insert feature interests:', error)
        throw error
      }
      console.info('[Onboard] Feature interests saved')
    }

    console.info('[Onboard] Onboarding completed successfully for user:', userId)

    return {
      success: true,
      message: 'Onboarding complete',
      timestamp: new Date().toISOString(),
    }
  } catch (err: any) {
    console.error('[Onboard] Error completing onboarding for user:', userId, err)
    throw createError({
      statusCode: 500,
      message: err.message || 'Failed to complete onboarding',
    })
  }
})
