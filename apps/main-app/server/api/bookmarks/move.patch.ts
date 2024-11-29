export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const supabase = await serverSupabaseClient(event)
    const { bookmarkIds, targetFolderId } = await readBody(event)

    // Verify user owns these bookmarks
    const { data: bookmarks, error: verifyError } = await supabase
      .from('bookmarks')
      .select('id')
      .in('id', bookmarkIds)
      .eq('user_id', user.id)

    if (verifyError || !bookmarks?.length) {
      throw createError({
        statusCode: 400,
        message: 'Invalid bookmark selection',
      })
    }

    // Move bookmarks to new folder
    const { error: updateError } = await supabase
      .from('bookmarks')
      .update({
        folder_id: targetFolderId,
        updated_at: new Date().toISOString(),
      })
      .in('id', bookmarkIds)
      .eq('user_id', user.id)

    if (updateError) throw updateError

    return { success: true }
  } catch (err) {
    console.error('Move bookmarks error:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal server error',
    })
  }
})
