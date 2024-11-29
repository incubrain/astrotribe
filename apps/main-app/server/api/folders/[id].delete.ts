// server/api/folders/[id].delete.ts
import type { H3Event } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized' })
    }

    const supabase = await serverSupabaseClient(event)
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { strategy, defaultFolderId } = body as {
      strategy: 'delete_all' | 'move_to_default'
      defaultFolderId?: string
    }

    // First try to update/delete bookmarks
    if (strategy === 'delete_all') {
      const { error: deleteError } = await supabase
        .from('bookmarks')
        .delete()
        .eq('folder_id', id)
        .eq('user_id', user.id)

      if (deleteError) {
        console.error('Delete bookmarks error:', deleteError)
        throw deleteError
      }
    } else {
      const { error: updateError } = await supabase
        .from('bookmarks')
        .update({ folder_id: defaultFolderId })
        .eq('folder_id', id)
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Update bookmarks error:', updateError)
        throw updateError
      }
    }

    // Then delete the folder
    const { error: folderError } = await supabase
      .from('bookmark_folders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (folderError) {
      console.error('Delete folder error:', folderError)
      throw folderError
    }

    return { success: true }
  } catch (err) {
    console.error('Folder Delete Error:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal server error',
    })
  }
})
