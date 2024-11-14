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
    const id = event.context.params.id

    // Check if this is the default folder
    const { data: folder } = await supabase
      .from('bookmark_folders')
      .select('is_default')
      .eq('id', id)
      .single()

    if (folder?.is_default) {
      throw createError({
        statusCode: 400,
        message: 'Cannot delete the default folder',
      })
    }

    // Delete the folder
    const { error } = await supabase
      .from('bookmark_folders')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) throw error
    return { success: true }
  } catch (err) {
    console.error('Folder Delete Error:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal server error',
    })
  }
})
