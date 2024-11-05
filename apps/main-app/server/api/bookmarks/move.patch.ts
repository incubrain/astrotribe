import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  const user = await serverSupabaseUser(event)

  if (!user) {
    return createError({
      status: 401,
      message: 'Unauthorized',
    })
  }

  const supabase = await serverSupabaseClient(event)
  const { bookmarkIds, targetFolderId } = await readBody(event)

  return await supabase
    .from('bookmarks')
    .update({ folder_id: targetFolderId })
    .in('id', bookmarkIds)
    .eq('user_id', user.id)
})
