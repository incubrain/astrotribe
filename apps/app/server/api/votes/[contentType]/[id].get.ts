import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { contentType, id } = event.context.params

  // Validate content type is handled by the system
  const { data: validContentType, error: typeError } = await client
    .from('content_types')
    .select('type_name')
    .eq('type_name', contentType)
    .single()

  if (typeError || !validContentType) {
    throw createError({ statusCode: 400, message: 'Invalid content type' })
  }

  try {
    // Query the content_interactions table for votes by this user on this content
    const { data, error } = await client
      .from('content_interactions')
      .select('details')
      .match({ content_id: id, user_id: user.id, interaction_type: 'vote' })
      .single()

    if (error && error.code !== 'PGRST116') throw error

    // Extract vote_type from details JSONB if it exists
    const voteType = data?.details?.vote_type || null

    return { voteType }
  } catch (error: any) {
    console.error('Get vote error:', error)
    throw createError({ statusCode: 500, message: 'Failed to get vote status' })
  }
})
