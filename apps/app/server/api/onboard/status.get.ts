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

    // Query user profile to check onboarding status
    const { data, error } = await client
      .from('user_profiles')
      .select('id, onboarding_completed, user_type')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching onboarding status:', error)
      throw createError({
        statusCode: 500,
        message: 'Failed to fetch onboarding status',
      })
    }

    // Return onboarding status
    return {
      completed: data?.onboarding_completed || false,
      user_type: data?.user_type || null,
      user_id: user.id,
    }
  } catch (error: any) {
    console.error('Onboarding status check error:', error)

    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Authentication required',
      })
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to check onboarding status',
    })
  }
})
