import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

// server/api/bookmarks/[id].delete.ts
export default defineEventHandler(async (event) => {
  const user = await serverSupabaseUser(event)
  const bookmarkId = event.context.params.id

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  const supabase = await serverSupabaseClient(event)

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id)

  if (error) {
    throw createError({
      statusCode: 500,
      message: 'Failed to delete bookmark',
    })
  }

  return { success: true }
})
