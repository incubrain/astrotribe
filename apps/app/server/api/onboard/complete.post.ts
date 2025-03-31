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

    // Connect to Supabase
    const client = await serverSupabaseClient(event)

    try {
      // Start a transaction
      await client.rpc('begin_transaction')

      // 1. Update onboarding_completed flag in user_profiles
      const { error: updateError } = await client
        .from('user_profiles')
        .update({ onboarding_completed: true })
        .eq('id', user.id)

      if (updateError) {
        throw new Error(`Failed to update onboarding status: ${updateError.message}`)
      }

      // 2. Save any final user type if it was changed
      if (body.userType) {
        const { error: userTypeError } = await client
          .from('user_profiles')
          .update({ user_type: body.userType })
          .eq('id', user.id)

        if (userTypeError) {
          throw new Error(`Failed to save user type: ${userTypeError.message}`)
        }
      }

      // 3. Save final interests if provided
      if (body.interests && Array.isArray(body.interests) && body.interests.length > 0) {
        // First clear existing interests
        await client.from('user_categories').delete().eq('user_id', user.id)

        // Then insert new ones
        const interestRows = body.interests.map((categoryId: string) => ({
          user_id: user.id,
          category_id: categoryId,
        }))

        const { error: interestsError } = await client.from('user_categories').insert(interestRows)

        if (interestsError) {
          throw new Error(`Failed to save interests: ${interestsError.message}`)
        }
      }

      // 4. Save final topics if provided
      if (body.topics && Array.isArray(body.topics) && body.topics.length > 0) {
        // First clear existing topics
        await client.from('user_tags').delete().eq('user_id', user.id)

        // Then insert new ones
        const topicRows = body.topics.map((tagId: string) => ({
          user_id: user.id,
          tag_id: tagId,
        }))

        const { error: topicsError } = await client.from('user_tags').insert(topicRows)

        if (topicsError) {
          throw new Error(`Failed to save topics: ${topicsError.message}`)
        }
      }

      // 5. Save final feature interests if provided
      if (
        body.featureInterests &&
        Array.isArray(body.featureInterests) &&
        body.featureInterests.length > 0
      ) {
        // First clear existing feature interests
        await client.from('user_features').delete().eq('user_id', user.id)

        // Then insert new ones
        const featureRows = body.featureInterests.map((featureId: string) => ({
          user_id: user.id,
          feature_id: featureId,
        }))

        const { error: featuresError } = await client.from('user_features').insert(featureRows)

        if (featuresError) {
          throw new Error(`Failed to save feature interests: ${featuresError.message}`)
        }
      }

      // 6. Save location if provided
      if (body.location && body.location.countryId) {
        const location = body.location

        // Check if user already has a primary address
        const { data: existingAddress } = await client
          .from('addresses')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_primary', true)
          .single()

        const addressData = {
          country_id: location.countryId,
          city_id: location.cityId,
          user_id: user.id,
          is_primary: true,
          address_type: 'residential',
        }

        let addressResult

        if (existingAddress) {
          // Update existing address
          addressResult = await client
            .from('addresses')
            .update(addressData)
            .eq('id', existingAddress.id)
        } else {
          // Insert new address
          addressResult = await client.from('addresses').insert({
            ...addressData,
            street1: 'Not provided', // Required field
            name: 'Primary Address', // Optional but useful
          })
        }

        if (addressResult.error) {
          throw new Error(`Failed to save location: ${addressResult.error.message}`)
        }
      }

      // Commit the transaction
      await client.rpc('commit_transaction')

      // Log successful completion
      console.log(`User ${user.id} completed onboarding successfully`)

      return {
        success: true,
        message: 'Onboarding completed successfully',
        timestamp: new Date().toISOString(),
      }
    } catch (transactionError: any) {
      // Rollback the transaction on any error
      await client.rpc('rollback_transaction')
      throw transactionError
    }
  } catch (error: any) {
    console.error('Complete onboarding error:', error)

    if (error.statusCode === 401) {
      throw createError({
        statusCode: 401,
        message: error.message || 'Authentication required',
      })
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to complete onboarding',
    })
  }
})
