// server/api/users/metrics.ts
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
    // Get all user votes first
    const { data: votes, error: votesError } = await client
      .from('votes')
      .select('*')
      .eq('user_id', user.id)
      .eq('content_type', 'news')
      .order('created_at', { ascending: false })

    if (votesError) throw votesError

    // If we have votes, get the corresponding news items
    if (votes && votes.length > 0) {
      const newsIds = votes.map((vote) => vote.content_id)

      // Get news items for accuracy calculation
      const { data: newsItems, error: newsError } = await client
        .from('news')
        .select('id, score')
        .in('id', newsIds)

      if (newsError) throw newsError

      // Create a lookup map for news scores
      const newsScores =
        newsItems?.reduce(
          (acc, news) => {
            acc[news.id] = news.score
            return acc
          },
          {} as Record<string, number>,
        ) || {}

      // Combine votes with news scores
      const votesWithScores = votes.map((vote) => ({
        ...vote,
        news_score: newsScores[vote.content_id] || 0,
      }))

      return {
        votes: votesWithScores,
        streakData: votes, // For streak calculation
        // Group votes by date for easier processing
        votesByDate: votes.reduce(
          (acc, vote) => {
            const date = new Date(vote.created_at).toISOString().split('T')[0]
            if (!acc[date]) acc[date] = []
            acc[date].push(vote)
            return acc
          },
          {} as Record<string, any[]>,
        ),
      }
    }

    return {
      votes: [],
      streakData: [],
      votesByDate: {},
    }
  } catch (error: any) {
    console.error('Get user metrics error:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to get user metrics',
    })
  }
})
