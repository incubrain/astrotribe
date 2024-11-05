import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const user = await serverSupabaseUser(event)
  const { content_id, content_type, metadata } = body

  if (!user) {
    return createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const supabase = await serverSupabaseClient(event)

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
      throw createError({
        statusCode: 500,
        message: 'Failed to remove bookmark',
      })
    }

    return {
      bookmarked: false,
    }
  }

  // Get default folder if needed
  let folder_id = null
  const { data: defaultFolder } = await supabase
    .from('bookmark_folders')
    .select('id')
    .eq('user_id', user.id)
    .eq('is_default', true)
    .single()

  if (defaultFolder) {
    folder_id = defaultFolder.id
  }

  // Create new bookmark
  const { data: newBookmark, error: bookError } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      content_id,
      content_type,
      folder_id,
      metadata: {
        ...metadata,
        bookmarked_at: new Date().toISOString(),
      },
    })
    .select()
    .single()

  if (bookError) {
    throw createError({
      statusCode: 500,
      message: 'Failed to create bookmark',
    })
  }

  return {
    bookmarked: true,
    data: newBookmark,
  }
})
