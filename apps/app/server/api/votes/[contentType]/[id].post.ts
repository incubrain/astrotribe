import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const { contentType, id } = getRouterParams(event)
  const { voteType } = await readBody(event)

  // Validate content type exists
  const { data: validContentType, error: typeError } = await client
    .from('content_types')
    .select('type_name')
    .eq('type_name', contentType)
    .single()

  if (typeError || !validContentType) {
    throw createError({ statusCode: 400, message: 'Invalid content type' })
  }

  // Validate vote type
  if (![1, -1].includes(voteType)) {
    throw createError({ statusCode: 400, message: 'Invalid vote type' })
  }

  try {
    // First, check if content exists
    const { data: contentExists, error: contentError } = await client
      .from('contents')
      .select('id')
      .eq('id', id)
      .single()

    if (contentError || !contentExists) {
      throw createError({ statusCode: 404, message: 'Content not found' })
    }

    // Check if user already voted
    const { data: existingVote, error: voteError } = await client
      .from('content_interactions')
      .select('id, details')
      .match({ content_id: id, user_id: user.id, interaction_type: 'vote' })
      .single()

    if (voteError && voteError.code !== 'PGRST116') throw voteError

    const existingVoteType = existingVote?.details?.vote_type || null

    // Handle vote removal if same vote type is sent
    if (existingVoteType === voteType) {
      // Remove the vote
      const { error: deleteError } = await client
        .from('content_interactions')
        .delete()
        .eq('id', existingVote.id)

      if (deleteError) throw deleteError

      // Update content hot_score (decrease by voteType)
      await client.rpc('update_content_score', { content_id: id, score_change: -voteType })

      return { success: true, action: 'removed' }
    }

    // Calculate score change
    let scoreChange = voteType
    if (existingVoteType) {
      // If changing vote type (e.g., from +1 to -1), we need to account for both
      scoreChange = voteType - existingVoteType
    }

    // Insert or update the vote
    if (existingVote) {
      // Update existing vote
      const { error: updateError } = await client
        .from('content_interactions')
        .update({ details: { ...existingVote.details, vote_type: voteType } })
        .eq('id', existingVote.id)

      if (updateError) throw updateError
    } else {
      // Insert new vote
      const { error: insertError } = await client
        .from('content_interactions')
        .insert({
          content_id: id,
          user_id: user.id,
          interaction_type: 'vote',
          details: { vote_type: voteType },
        })

      if (insertError) throw insertError
    }

    // Update content hot_score
    await client.rpc('update_content_score', { content_id: id, score_change: scoreChange })

    return { success: true, action: 'voted' }
  } catch (error: any) {
    console.error('Vote error:', error)
    throw createError({ statusCode: 500, message: 'Failed to process vote' })
  }
})

// You will need to create this function in your database:
/*
CREATE OR REPLACE FUNCTION update_content_score(
  content_id UUID,
  score_change INTEGER
) RETURNS VOID AS $$
BEGIN
  UPDATE contents
  SET hot_score = hot_score + score_change
  WHERE id = content_id;
END;
$$ LANGUAGE plpgsql;
*/
