import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = await serverSupabaseUser(event)
  const { content_id, content_type, folder_id, metadata } = body

  if (!user) {
    return createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const supabase = await serverSupabaseClient(event)

  try {
    // Check if bookmark exists
    const { data: existing } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', user.id)
      .eq('content_id', content_id)
      .eq('content_type', content_type)
      .maybeSingle()

    if (existing) {
      // Remove bookmark
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .match({ id: existing.id })

      if (deleteError) {
        console.error('Failed to remove bookmark:', deleteError)
        throw createError({
          statusCode: 500,
          message: 'Failed to remove bookmark',
        })
      }

      // Also try to remove the bookmark interaction, but don't fail if it doesn't exist
      try {
        await supabase.from('content_interactions').delete().match({
          content_id,
          user_id: user.id,
          interaction_type: 'bookmark',
        })
      } catch (interactionError) {
        console.warn(
          'Failed to remove bookmark interaction, but bookmark was removed:',
          interactionError,
        )
      }

      return {
        bookmarked: false,
      }
    }

    // Get default folder if needed
    let targetFolderId = folder_id
    if (!targetFolderId) {
      const { data: defaultFolder } = await supabase
        .from('bookmark_folders')
        .select('id')
        .eq('user_id', user.id)
        .eq('is_default', true)
        .single()

      targetFolderId = defaultFolder?.id
    }

    // Create new bookmark
    const bookmarkData = {
      user_id: user.id,
      content_id,
      content_type,
      folder_id: targetFolderId,
      metadata: {
        ...metadata,
        bookmarked_at: new Date().toISOString(),
      },
    }

    const { data: newBookmark, error: bookError } = await supabase
      .from('bookmarks')
      .insert(bookmarkData)
      .select()
      .single()

    if (bookError) {
      console.error('Failed to create bookmark:', bookError)
      throw createError({
        statusCode: 500,
        message: 'Failed to create bookmark: ' + bookError.message,
      })
    }

    // Try to create a bookmark interaction for analytics
    // But don't fail if this step fails
    try {
      await supabase.from('content_interactions').insert({
        content_id,
        user_id: user.id,
        interaction_type: 'bookmark',
        details: {
          folder_id: targetFolderId,
        },
      })
    } catch (interactionError) {
      console.warn(
        'Failed to create bookmark interaction, but bookmark was created:',
        interactionError,
      )
    }

    return {
      bookmarked: true,
      data: newBookmark,
    }
  } catch (error: any) {
    console.error('Error in bookmark toggle:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Internal server error',
    })
  }
})
