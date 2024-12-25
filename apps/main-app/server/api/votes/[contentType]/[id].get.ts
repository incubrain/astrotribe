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

  const { contentType, id } = event.context.params

  try {
    const { data, error } = await client
      .from('votes')
      .select('vote_type')
      .match({
        content_type: contentType,
        content_id: id,
        user_id: user.id,
      })
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return {
      voteType: data?.vote_type || null,
    }
  } catch (error: any) {
    console.error('Get vote error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get vote status',
    })
  }
})
