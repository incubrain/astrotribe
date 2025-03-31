import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get current authenticated user
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized - authentication required',
      })
    }

    // Parse request body
    const body = await readBody(event)
    const { step, data } = body

    if (!step || !data) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: step and data',
      })
    }

    // Connect to Supabase
    const client = await serverSupabaseClient(event)

    // Handle based on step number
    switch (step) {
      case 1: // User Type
        return await saveUserType(client, user.id, data)

      case 2: // Professional Details
        // Professional details are optional and could be skipped
        // No additional data to save for now
        return { success: true }

      case 3: // Interests
        return await saveInterests(client, user.id, data.interests)

      case 4: // Feature Interests
        return await saveFeatureInterests(client, user.id, data.featureInterests)

      case 5: // Topics
        return await saveTopics(client, user.id, data.topics)

      case 6: // Location
        return await saveLocation(client, user.id, data.location)

      default:
        throw createError({
          statusCode: 400,
          message: `Invalid step: ${step}`,
        })
    }
  } catch (error: any) {
    console.error('Save onboarding step error:', error)

    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Authentication required',
      })
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save onboarding step',
    })
  }
})

/**
 * Save user type to user profile
 */
async function saveUserType(client: any, userId: string, data: any) {
  // Update user_type in profiles table
  const { error } = await client
    .from('user_profiles')
    .update({ user_type: data.userType })
    .eq('id', userId)

  if (error) {
    console.error('Error saving user type:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to save user type',
    })
  }

  return { success: true }
}

/**
 * Save user interests (categories)
 */
async function saveInterests(client: any, userId: string, interests: string[]) {
  if (!interests || !Array.isArray(interests)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid interests data',
    })
  }

  try {
    // First, delete any existing interests
    const { error: deleteError } = await client
      .from('user_categories')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing interests:', deleteError)
      throw new Error('Failed to update interests')
    }

    // Skip if no interests selected
    if (interests.length === 0) {
      return { success: true }
    }

    // Insert new interests
    const interestRows = interests.map((categoryId: string) => ({
      user_id: userId,
      category_id: categoryId,
    }))

    const { error: insertError } = await client.from('user_categories').insert(interestRows)

    if (insertError) {
      console.error('Error inserting interests:', insertError)
      throw new Error('Failed to save interests')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in saveInterests:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save interests',
    })
  }
}

/**
 * Save user feature interests
 */
async function saveFeatureInterests(client: any, userId: string, featureInterests: string[]) {
  if (!featureInterests || !Array.isArray(featureInterests)) {
    // Feature interests are optional, return success if not provided
    return { success: true }
  }

  try {
    // First, delete any existing feature interests
    const { error: deleteError } = await client.from('user_features').delete().eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing feature interests:', deleteError)
      throw new Error('Failed to update feature interests')
    }

    // Skip if no feature interests selected
    if (featureInterests.length === 0) {
      return { success: true }
    }

    // Insert new feature interests
    const featureRows = featureInterests.map((featureId: string) => ({
      user_id: userId,
      feature_id: featureId,
    }))

    const { error: insertError } = await client.from('user_features').insert(featureRows)

    if (insertError) {
      console.error('Error inserting feature interests:', insertError)
      throw new Error('Failed to save feature interests')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in saveFeatureInterests:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save feature interests',
    })
  }
}

/**
 * Save user topics (tags)
 */
async function saveTopics(client: any, userId: string, topics: string[]) {
  if (!topics || !Array.isArray(topics)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid topics data',
    })
  }

  try {
    // First, delete any existing topics
    const { error: deleteError } = await client.from('user_tags').delete().eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing topics:', deleteError)
      throw new Error('Failed to update topics')
    }

    // Skip if no topics selected
    if (topics.length === 0) {
      return { success: true }
    }

    // Insert new topics
    const topicRows = topics.map((tagId: string) => ({
      user_id: userId,
      tag_id: tagId,
    }))

    const { error: insertError } = await client.from('user_tags').insert(topicRows)

    if (insertError) {
      console.error('Error inserting topics:', insertError)
      throw new Error('Failed to save topics')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in saveTopics:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save topics',
    })
  }
}

/**
 * Save user location
 */
async function saveLocation(client: any, userId: string, location: any) {
  if (!location) {
    // Location is optional, return success if not provided
    return { success: true }
  }

  const { countryId, cityId } = location

  // Skip if no location data
  if (!countryId && !cityId) {
    return { success: true }
  }

  try {
    // Check if user already has a primary address
    const { data: existingAddress, error: fetchError } = await client
      .from('addresses')
      .select('id')
      .eq('user_id', userId)
      .eq('is_primary', true)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = No rows returned
      console.error('Error fetching existing address:', fetchError)
      throw new Error('Failed to check existing address')
    }

    // Prepare address data
    const addressData = {
      country_id: countryId,
      city_id: cityId,
      user_id: userId,
      is_primary: true,
      address_type: 'residential',
    }

    let result

    if (existingAddress) {
      // Update existing address
      result = await client.from('addresses').update(addressData).eq('id', existingAddress.id)
    } else {
      // Insert new address
      result = await client.from('addresses').insert({
        ...addressData,
        // Required fields for new addresses
        street1: 'Not provided', // Required field
        name: 'Primary Address', // Optional but useful
      })
    }

    if (result.error) {
      console.error('Error saving location:', result.error)
      throw new Error('Failed to save location')
    }

    return { success: true }
  } catch (error: any) {
    console.error('Error in saveLocation:', error)
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to save location',
    })
  }
}
