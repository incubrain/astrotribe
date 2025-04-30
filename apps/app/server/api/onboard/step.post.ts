import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  try {
    // Get current authenticated user
    const user = await serverSupabaseUser(event)

    if (!user) {
      return {
        success: false,
        message: 'Unauthorized - authentication required',
        statusCode: 401,
      }
    }

    // Parse request body
    const body = await readBody(event)
    const { step, data } = body

    // Added validation of the data structure
    if (!step || typeof step !== 'number' || step < 1 || step > 7) {
      return {
        success: false,
        message: `Invalid step: ${step}. Must be a number between 1 and 7.`,
        statusCode: 400,
      }
    }

    if (!data || typeof data !== 'object') {
      return {
        success: false,
        message: 'Invalid data. Must be an object.',
        statusCode: 400,
      }
    }

    // Debug information
    console.log(`Processing step ${step} for user ${user.id}. Data:`, JSON.stringify(data))

    // Connect to Supabase
    const client = await serverSupabaseClient(event)

    // Handle based on step number
    let result
    switch (step) {
      case 1: // User Type
        result = await saveUserType(client, user.id, data)
        break

      // case 2: // Professional Details
      //   result = await saveProfessionalDetails(client, user.id, data)
      //   break

      case 3: // Interests
        result = await saveInterests(client, user.id, data)
        break

      case 4: // Feature Interests
        result = await saveFeatureInterests(client, user.id, data)
        break

      case 5: // Topics
        result = await saveTopics(client, user.id, data)
        break

      case 6: // Location
        result = await saveLocation(client, user.id, data)
        break

      case 7: // Confirmation - no data to save
        result = { success: true }
        break

      default:
        return {
          success: false,
          message: `Invalid step: ${step}`,
          statusCode: 400,
        }
    }

    // Return standardized response
    return {
      success: true,
      data: result,
      message: `Successfully saved step ${step} data`,
    }
  } catch (error: any) {
    console.error('Save onboarding step error:', error)

    // Return standardized error response
    return {
      success: false,
      message: error.message || 'Failed to save onboarding step',
      statusCode: error.statusCode || 500,
    }
  }
})

/**
 * Save user type to user profile
 */
async function saveUserType(client: any, user_id: string, data: any) {
  try {
    if (!data.user_type) {
      throw new Error('User type is required')
    }

    // Update user_type in profiles table
    const { error } = await client
      .from('user_profiles')
      .update({ user_type: data.user_type })
      .eq('id', user_id)

    if (error) {
      console.error('Error saving user type:', error)
      throw new Error('Failed to save user type: ' + error.message)
    }

    return { user_type: data.user_type }
  } catch (error: any) {
    console.error('Error in saveUserType:', error)
    throw new Error(error.message || 'Failed to save user type')
  }
}

/**
 * Save professional details to user profile
 */
// async function saveProfessionalDetails(client: any, user_id: string, data: any) {
//   try {
//     // Professional details are optional
//     if (!data || Object.keys(data).length === 0) {
//       return { success: true }
//     }

//     // Store professional details in user metadata or a separate table
//     // This is a placeholder implementation - adjust if there's a dedicated table
//     const { error } = await client
//       .from('user_profiles')
//       .update({
//         professional_details: data,
//       })
//       .eq('id', user_id)

//     if (error) {
//       console.error('Error saving professional details:', error)
//       throw new Error('Failed to save professional details: ' + error.message)
//     }

//     return { saved: true }
//   } catch (error: any) {
//     console.error('Error in saveProfessionalDetails:', error)
//     throw new Error(error.message || 'Failed to save professional details')
//   }
// }

/**
 * Save user interests (categories)
 */
async function saveInterests(client: any, user_id: string, data: any) {
  try {
    // Validate interests data
    const interests = data.interests || []
    if (!Array.isArray(interests)) {
      throw new Error('Invalid interests data. Expected an array.')
    }

    // First, delete any existing interests
    const { error: deleteError } = await client
      .from('user_categories')
      .delete()
      .eq('user_id', user_id)

    if (deleteError) {
      console.error('Error deleting existing interests:', deleteError)
      throw new Error('Failed to update interests: ' + deleteError.message)
    }

    // Skip if no interests selected
    if (interests.length === 0) {
      return { saved: true, count: 0 }
    }

    // Insert new interests
    const interestRows = interests.map((category_id: string) => ({
      user_id: user_id,
      category_id: category_id,
    }))

    const { error: insertError } = await client.from('user_categories').insert(interestRows)

    if (insertError) {
      console.error('Error inserting interests:', insertError)
      throw new Error('Failed to save interests: ' + insertError.message)
    }

    return { saved: true, count: interests.length }
  } catch (error: any) {
    console.error('Error in saveInterests:', error)
    throw new Error(error.message || 'Failed to save interests')
  }
}

/**
 * Save user feature interests using the feature_engagements table
 */
async function saveFeatureInterests(client: any, user_id: string, data: any) {
  try {
    // Validate feature interests data
    const featureIds = data.feature_interests || []
    if (!Array.isArray(featureIds)) {
      throw new Error('Invalid feature interests data. Expected an array.')
    }

    console.log(`Saving feature interests for user ${user_id}: ${featureIds.join(', ')}`)

    // First, delete existing selections (only 'selected' type)
    const { error: deleteError } = await client
      .from('feature_engagements')
      .delete()
      .eq('user_id', user_id)
      .eq('engagement_type', 'selected')

    if (deleteError) {
      console.error('Error deleting existing feature engagements:', deleteError)
      throw new Error('Failed to update feature interests: ' + deleteError.message)
    }

    // Skip if no features selected
    if (featureIds.length === 0) {
      return { saved: true, count: 0 }
    }

    // Insert new feature engagements
    const featureEngagements = featureIds.map((featureId: string) => ({
      user_id: user_id,
      feature_id: featureId,
      engagement_type: 'selected',
      created_at: new Date().toISOString(),
    }))

    const { error: insertError } = await client
      .from('feature_engagements')
      .insert(featureEngagements)

    if (insertError) {
      console.error('Error inserting feature engagements:', insertError)
      throw new Error('Failed to save feature interests: ' + insertError.message)
    }

    return { saved: true, count: featureIds.length }
  } catch (error: any) {
    console.error('Error in saveFeatureInterests:', error)
    throw new Error(error.message || 'Failed to save feature interests')
  }
}

/**
 * Save user topics (tags)
 */
async function saveTopics(client: any, user_id: string, data: any) {
  try {
    // Validate topics data
    const topics = data.topics || []
    if (!Array.isArray(topics)) {
      throw new Error('Invalid topics data. Expected an array.')
    }

    // First, delete any existing topics
    const { error: deleteError } = await client.from('user_tags').delete().eq('user_id', user_id)

    if (deleteError) {
      console.error('Error deleting existing topics:', deleteError)
      throw new Error('Failed to update topics: ' + deleteError.message)
    }

    // Skip if no topics selected
    if (topics.length === 0) {
      return { saved: true, count: 0 }
    }

    // Insert new topics
    const topicRows = topics.map((tagId: string) => ({
      user_id: user_id,
      tag_id: tagId,
    }))

    const { error: insertError } = await client.from('user_tags').insert(topicRows)

    if (insertError) {
      console.error('Error inserting topics:', insertError)
      throw new Error('Failed to save topics: ' + insertError.message)
    }

    return { saved: true, count: topics.length }
  } catch (error: any) {
    console.error('Error in saveTopics:', error)
    throw new Error(error.message || 'Failed to save topics')
  }
}

/**
 * Save user location
 */
async function saveLocation(client: any, user_id: string, data: any) {
  try {
    // Location is optional
    const location = data?.location
    if (!location) {
      return { saved: true }
    }

    // Extract location data - accommodate different data structures
    let countryId, cityId, latitude, longitude

    if (typeof location === 'object') {
      countryId = location.countryId || location.country_id
      cityId = location.cityId || location.city_id
      latitude = location.latitude
      longitude = location.longitude
    }

    // Skip if no location data
    if (!countryId && !cityId && !latitude && !longitude) {
      return { saved: true }
    }

    // Check if user already has a primary address
    const { data: existingAddress, error: fetchError } = await client
      .from('addresses')
      .select('id')
      .eq('user_id', user_id)
      .eq('is_primary', true)
      .single()

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = No rows returned
      console.error('Error fetching existing address:', fetchError)
      throw new Error('Failed to check existing address: ' + fetchError.message)
    }

    // Prepare address data
    const addressData = {
      country_id: countryId,
      city_id: cityId,
      user_id: user_id,
      is_primary: true,
      address_type: 'residential',
      // Add location coordinates if available
      coordinates: latitude && longitude ? { lat: latitude, lng: longitude } : undefined,
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
      throw new Error('Failed to save location: ' + result.error.message)
    }

    return { saved: true, location: addressData }
  } catch (error: any) {
    console.error('Error in saveLocation:', error)
    throw new Error(error.message || 'Failed to save location')
  }
}
