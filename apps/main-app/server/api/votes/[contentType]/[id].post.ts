import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const { contentType, id } = getRouterParams(event)
  const { voteType } = await readBody(event)

  // Validate content type (only news for now)
  if (contentType !== 'news') {
    throw createError({
      statusCode: 400,
      message: 'Invalid content type',
    })
  }

  // Validate vote type
  if (![1, -1].includes(voteType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid vote type',
    })
  }

  try {
    // Handle vote removal if same vote type is sent
    const { data: existingVote } = await client
      .from('votes')
      .select('vote_type')
      .match({
        content_type: contentType,
        content_id: id,
        user_id: user.id,
      })
      .single()

    if (existingVote?.vote_type === voteType) {
      // Remove the vote if it's the same type
      const { error } = await client.from('votes').delete().match({
        content_type: contentType,
        content_id: id,
        user_id: user.id,
      })

      if (error) throw error
      return { success: true, action: 'removed' }
    }

    // Insert or update the vote
    const { error } = await client.from('votes').upsert(
      {
        content_type: contentType,
        content_id: id,
        user_id: user.id,
        vote_type: voteType,
      },
      {
        onConflict: 'content_type,content_id,user_id',
      },
    )

    if (error) throw error
    return { success: true, action: 'voted' }
  } catch (error: any) {
    console.error('Vote error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process vote',
    })
  }
})
