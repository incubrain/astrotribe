// server/api/users/metrics.ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    // Get all user votes from content_interactions (votes)
    const { data: votes, error: votesError } = await client
      .from('content_interactions')
      .select(
        `
        id, 
        content_id, 
        created_at, 
        details
      `,
      )
      .eq('user_id', user.id)
      .eq('interaction_type', 'vote')
      .order('created_at', { ascending: false })

    if (votesError) throw votesError

    // If we have votes, get the corresponding content items for score/accuracy calculation
    if (votes && votes.length > 0) {
      const contentIds = votes.map((vote) => vote.content_id)

      // Get content items for accuracy calculation
      const { data: contentItems, error: contentError } = await client
        .from('contents')
        .select('id, hot_score')
        .in('id', contentIds)

      if (contentError) throw contentError

      // Create a lookup map for content scores
      const contentScores =
        contentItems?.reduce(
          (acc, content) => {
            acc[content.id] = content.hot_score
            return acc
          },
          {} as Record<string, number>,
        ) || {}

      // Combine votes with content scores
      const votesWithScores = votes.map((vote) => ({
        id: vote.id,
        content_id: vote.content_id,
        created_at: vote.created_at,
        vote_type: vote.details?.vote_type || 0, // Extract from JSONB
        news_score: contentScores[vote.content_id] || 0,
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

    return { votes: [], streakData: [], votesByDate: {} }
  } catch (error: any) {
    console.error('Get user metrics error:', error)
    throw createError({ statusCode: 500, message: 'Failed to get user metrics' })
  }
})
