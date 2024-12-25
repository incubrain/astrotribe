// server/api/folders/[id].patch.ts
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
    const updates = await readBody(event)

    // Validate updates
    if (updates.name !== undefined && !updates.name.trim()) {
      throw createError({
        statusCode: 400,
        message: 'Folder name cannot be empty',
      })
    }

    const { data, error } = await supabase
      .from('bookmark_folders')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error: any) throw error
    return { data }
  } catch (err) {
    console.error('Folder Update Error:', err)
    throw createError({
      statusCode: err.statusCode || 500,
      message: err.message || 'Internal server error',
    })
  }
})
