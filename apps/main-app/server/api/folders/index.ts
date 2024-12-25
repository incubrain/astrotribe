// server/api/folders/index.ts
import type { H3Event } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await serverSupabaseUser(event)
    if (!user) {
      throw createError({ statusCode: 401, message: 'Unauthorized: No user object' })
    }

    const supabase = await serverSupabaseClient(event)

    // GET /api/folders
    if (event.method === 'GET') {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .select('*')
        .eq('user_id', user.id)
        .order('position')

      if (error: any) throw error
      return { data }
    }

    // POST /api/folders
    if (event.method === 'POST') {
      const body = await readBody(event)

      // Validate required fields
      if (!body.name?.trim()) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Folder name is required',
        })
      }

      // Get current folder count
      const { count } = await supabase
        .from('bookmark_folders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      // Validate feature limit
      await validateFeatureLimit(event, 'BOOKMARK_FOLDERS', count || 0)

      // Insert new folder
      const { data, error: insertError } = await supabase
        .from('bookmark_folders')
        .insert({
          ...body,
          user_id: user.id,
          position: count || 0,
        })
        .select()
        .single()

      if (insertError) throw insertError
      return { data }
    }

    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' })
  } catch (err) {
    console.error('Folder API Error:', err)
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || 'Internal server error',
    })
  }
})
