import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const action = event.context.params?.action

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  try {
    switch (action) {
      // List available features
      case 'list': {
        return await listFeatures(client)
      }

      // Rank or vote on features
      case 'rank': {
        const body = await readBody(event)
        const { rankings } = body
        return await rankFeatures(client, user.id, rankings)
      }

      // Get user's selected features
      case 'selected': {
        return await getSelectedFeatures(client, user.id)
      }

      // Save feature selections
      case 'select': {
        const body = await readBody(event)
        const { featureIds } = body
        return await selectFeatures(client, user.id, featureIds)
      }

      // Add feedback for a feature
      case 'feedback': {
        const body = await readBody(event)
        const { featureId, feedback } = body
        return await addFeatureFeedback(client, user.id, featureId, feedback)
      }

      // Submit a new feature request
      case 'request': {
        const body = await readBody(event)
        return await submitFeatureRequest(client, user.id, body)
      }

      // Default error handler
      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid action',
        })
    }
  } catch (error) {
    console.error(`Feature API error (${action}):`, error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'An error occurred while processing your request',
    })
  }
})

/**
 * List available features
 */
async function listFeatures(client) {
  try {
    // Fetch from the features table
    const { data: features, error } = await client
      .from('features')
      .select('id, title, description, status, type, visibility, created_at, updated_at')
      .eq('visibility', true) // Only get public features
      .order('status', { ascending: false }) // Live and building before planned

    if (error) {
      throw createError({ statusCode: 500, message: error.message })
    }

    return features || []
  } catch (error) {
    console.error('Error listing features:', error)
    throw error
  }
}

/**
 * Rank or vote on features
 */
async function rankFeatures(client, userId, rankings) {
  try {
    if (!rankings || !Array.isArray(rankings) || rankings.length === 0) {
      return { success: true, message: 'No rankings to update' }
    }

    // Use feature_engagements table for voting/ranking
    const { error: rankError } = await client.from('feature_engagements').upsert(
      rankings.map((ranking) => ({
        user_id: userId,
        feature_id: ranking.feature_id,
        engagement_type: ranking.type || 'vote_up',
        created_at: new Date().toISOString(),
      })),
      {
        onConflict: 'user_id,feature_id,engagement_type',
      },
    )

    if (rankError) {
      throw createError({ statusCode: 500, message: rankError.message })
    }

    return { success: true }
  } catch (error) {
    console.error('Error ranking features:', error)
    throw error
  }
}

/**
 * Get user's selected features
 */
async function getSelectedFeatures(client, userId) {
  try {
    // Get from feature_engagements
    const { data: engagements, error } = await client
      .from('feature_engagements')
      .select('feature_id, engagement_type, created_at')
      .eq('user_id', userId)
      .eq('engagement_type', 'selected')

    if (error) {
      throw createError({ statusCode: 500, message: error.message })
    }

    return engagements || []
  } catch (error) {
    console.error('Error getting selected features:', error)
    throw error
  }
}

/**
 * Save feature selections
 */
async function selectFeatures(client, userId, featureIds) {
  try {
    if (!Array.isArray(featureIds)) {
      throw createError({ statusCode: 400, message: 'featureIds must be an array' })
    }

    // First, delete existing selections
    const { error: deleteError } = await client
      .from('feature_engagements')
      .delete()
      .eq('user_id', userId)
      .eq('engagement_type', 'selected')

    if (deleteError) {
      throw createError({ statusCode: 500, message: deleteError.message })
    }

    // Then insert new selections
    if (featureIds.length > 0) {
      const { error: insertError } = await client.from('feature_engagements').insert(
        featureIds.map((featureId) => ({
          user_id: userId,
          feature_id: featureId,
          engagement_type: 'selected',
          created_at: new Date().toISOString(),
        })),
      )

      if (insertError) {
        throw createError({ statusCode: 500, message: insertError.message })
      }
    }

    return { success: true, count: featureIds.length }
  } catch (error) {
    console.error('Error selecting features:', error)
    throw error
  }
}

/**
 * Add feedback for a feature
 */
async function addFeatureFeedback(client, userId, featureId, feedback) {
  try {
    if (!featureId) {
      throw createError({ statusCode: 400, message: 'featureId is required' })
    }

    if (!feedback || typeof feedback !== 'string') {
      throw createError({ statusCode: 400, message: 'feedback must be a non-empty string' })
    }

    // Check if feedback already exists
    const { data: existingFeedback, error: checkError } = await client
      .from('feature_engagements')
      .select('id')
      .eq('user_id', userId)
      .eq('feature_id', featureId)
      .eq('engagement_type', 'feedback')
      .maybeSingle()

    if (checkError) {
      throw createError({ statusCode: 500, message: checkError.message })
    }

    if (existingFeedback) {
      // Update existing feedback
      const { error: updateError } = await client
        .from('feature_engagements')
        .update({ feedback })
        .eq('id', existingFeedback.id)

      if (updateError) {
        throw createError({ statusCode: 500, message: updateError.message })
      }
    } else {
      // Insert new feedback
      const { error: insertError } = await client.from('feature_engagements').insert({
        user_id: userId,
        feature_id: featureId,
        engagement_type: 'feedback',
        feedback,
        created_at: new Date().toISOString(),
      })

      if (insertError) {
        throw createError({ statusCode: 500, message: insertError.message })
      }
    }

    return { success: true }
  } catch (error) {
    console.error('Error adding feature feedback:', error)
    throw error
  }
}

/**
 * Submit a new feature request
 */
async function submitFeatureRequest(client, userId, requestData) {
  try {
    if (!requestData.title) {
      throw createError({ statusCode: 400, message: 'Feature title is required' })
    }

    // First check if a similar feature already exists
    const { data: existingFeatures } = await client
      .from('features')
      .select('id, title')
      .ilike('title', `%${requestData.title}%`)
      .limit(5)

    // Store in feature_requests table (for review before adding to main features)
    const { data: insertData, error: insertError } = await client
      .from('feature_requests')
      .insert({
        title: requestData.title,
        description: requestData.description || '',
        status: 'pending',
        submitted_by: userId,
        similar_features: existingFeatures || [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (insertError) {
      throw createError({ statusCode: 500, message: insertError.message })
    }

    // Automatically add a positive engagement for the user's own feature
    await client
      .from('feature_engagements')
      .insert({
        user_id: userId,
        feature_id: insertData.id,
        engagement_type: 'vote_up',
        created_at: new Date().toISOString(),
      })
      .catch((error) => console.error('Error adding initial vote engagement:', error))

    return insertData
  } catch (error) {
    console.error('Error submitting feature request:', error)
    throw error
  }
}
