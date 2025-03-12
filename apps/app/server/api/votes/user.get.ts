import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  try {
    // Updated to query content_interactions table for vote type interactions
    const { data, error } = await client
      .from('content_interactions')
      .select('content_id, details')
      .eq('interaction_type', 'vote')
      .eq('user_id', user.id)

    if (error) throw error

    // Transform into a more efficient lookup object
    // Extract vote_type from details JSONB
    const voteLookup = data.reduce(
      (acc, interaction) => {
        const voteType = interaction.details?.vote_type
        if (voteType !== undefined) {
          acc[interaction.content_id] = voteType
        }
        return acc
      },
      {} as Record<string, number>,
    )

    return { votes: voteLookup }
  } catch (error: any) {
    console.error('Get votes error:', error)
    throw createError({ statusCode: 500, message: 'Failed to get votes' })
  }
})
