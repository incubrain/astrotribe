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

    // Connect to Supabase
    const client = await serverSupabaseClient(event)

    // Query user profile data
    const { data: profile, error: profileError } = await client
      .from('user_profiles')
      .select('id, user_type, onboarding_completed')
      .eq('id', user.id)
      .single()

    if (profileError) {
      console.error('Error fetching user profile:', profileError)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch user profile',
      })
    }

    // Get categories (interests)
    const { data: userCategories, error: categoriesError } = await client
      .from('user_categories')
      .select('category_id')
      .eq('user_id', user.id)

    if (categoriesError) {
      console.error('Error fetching user categories:', categoriesError)
    }

    // Get topics (tags)
    const { data: userTags, error: tagsError } = await client
      .from('user_tags')
      .select('tag_id')
      .eq('user_id', user.id)

    if (tagsError) {
      console.error('Error fetching user tags:', tagsError)
    }

    // Get feature interests
    const { data: userFeatures, error: featuresError } = await client
      .from('user_features')
      .select('feature_id')
      .eq('user_id', user.id)

    if (featuresError) {
      console.error('Error fetching user features:', featuresError)
    }

    // Get location information (if any)
    const { data: address, error: addressError } = await client
      .from('addresses')
      .select('id, city_id, country_id')
      .eq('user_id', user.id)
      .eq('is_primary', true)
      .single()

    if (addressError && addressError.code !== 'PGRST116') {
      // PGRST116 = No rows returned
      console.error('Error fetching user address:', addressError)
    }

    // Format and return the data
    return {
      userType: profile?.user_type || null,
      onboardingCompleted: profile?.onboarding_completed || false,
      interests: userCategories?.map((item) => item.category_id) || [],
      topics: userTags?.map((item) => item.tag_id) || [],
      featureInterests: userFeatures?.map((item) => item.feature_id) || [],
      location: address
        ? {
            countryId: address.country_id,
            cityId: address.city_id,
          }
        : null,
    }
  } catch (error: any) {
    console.error('Onboarding data fetch error:', error)

    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Authentication required',
      })
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch onboarding data',
    })
  }
})
