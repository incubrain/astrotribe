import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)

  if (!user) {
    throw createError({ statusCode: 401, message: 'Unauthorized' })
  }

  const voteType = parseInt(event.context.params.voteType) // 1 for upvotes, -1 for downvotes

  if (![1, -1].includes(voteType)) {
    throw createError({ statusCode: 400, message: 'Invalid vote type' })
  }

  try {
    // Get content IDs from interactions with the specified vote type
    const { data: interactionData, error: interactionError } = await client
      .from('content_interactions')
      .select('content_id')
      .eq('interaction_type', 'vote')
      .eq('user_id', user.id)
      .contains('details', { vote_type: voteType })

    if (interactionError) throw interactionError

    const contentIds = interactionData.map((item) => item.content_id)

    if (contentIds.length === 0) {
      return []
    }

    // Query the contents table for items with the specified content IDs
    // This assumes we're primarily interested in content with type 'news'
    const { data: contentsData, error: contentsError } = await client
      .from('contents')
      .select(
        `
        id, 
        content_type,
        title, 
        url, 
        created_at, 
        hot_score,
        published_at, 
        description, 
        author, 
        featured_image, 
        source_id,
        company_id,
        details
      `,
      )
      .in('id', contentIds)
      .eq('content_type', 'news')
      .order('published_at', { ascending: false })

    if (contentsError) throw contentsError

    return contentsData || []
  } catch (error: any) {
    console.error('Get voted news error:', error)
    throw createError({ statusCode: 500, message: 'Failed to get voted news' })
  }
})
