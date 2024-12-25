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

  try {
    const { data, error } = await client
      .from('votes')
      .select('content_id, vote_type')
      .eq('content_type', 'news')
      .eq('user_id', user.id)

    if (error: any) throw error

    // Transform into a more efficient lookup object
    const voteLookup = data.reduce(
      (acc, vote) => {
        acc[vote.content_id] = vote.vote_type
        return acc
      },
      {} as Record<string, number>,
    )

    return {
      votes: voteLookup,
    }
  } catch (error: any) {
    console.error('Get votes error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get votes',
    })
  }
})
