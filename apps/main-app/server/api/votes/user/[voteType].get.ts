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

  const voteType = parseInt(event.context.params.voteType) // 1 for upvotes, -1 for downvotes

  if (![1, -1].includes(voteType)) {
    throw createError({
      statusCode: 400,
      message: 'Invalid vote type',
    })
  }

  try {
    const { data, error } = await client
      .from('votes')
      .select('content_id')
      .eq('content_type', 'news')
      .eq('user_id', user.id)
      .eq('vote_type', voteType)

    if (error: any) throw error

    // Get the actual news items
    const { data: news, error: newsError } = await client
      .from('news')
      .select('*')
      .in(
        'id',
        data.map((v) => v.content_id),
      )
      .order('created_at', { ascending: false })

    if (newsError) throw newsError

    return news
  } catch (error: any) {
    console.error('Get voted news error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get voted news',
    })
  }
})
