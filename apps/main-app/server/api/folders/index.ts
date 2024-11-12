// server/api/folders/index.ts
import type { H3Event } from 'h3'
import { serverSupabaseUser, serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event: H3Event) => {
  try {
    const user = await serverSupabaseUser(event)

    if (!user) {
      throw createError({
        statusCode: 401,
        message: 'Unauthorized',
      })
    }

    const supabase = await serverSupabaseClient(event)

    if (event.method === 'GET') {
      const { data, error } = await supabase
        .from('bookmark_folders')
        .select('*')
        .eq('user_id', user.id)
        .order('position')

      if (error) throw error

      return { data }
    }

    if (event.method === 'POST') {
      const body = await readBody(event)

      // Validate required fields
      if (!body.name?.trim()) {
        throw createError({
          statusCode: 400,
          message: 'Folder name is required',
        })
      }

      // Get current folder count
      const { count, error: countError } = await supabase
        .from('bookmark_folders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      if (countError) throw countError

      // Validate feature limit
      await validateFeatureLimit(event, 'BOOKMARK_FOLDERS', count || 0)

      // Handle default folder
      if (body.is_default) {
        await supabase
          .from('bookmark_folders')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true)
      }

      // Calculate path
      let path = body.name.toLowerCase().replace(/\s+/g, '_')
      if (body.parent_id) {
        const { data: parent, error: parentError } = await supabase
          .from('bookmark_folders')
          .select('path')
          .eq('id', body.parent_id)
          .single()

        if (parentError) throw parentError
        if (!parent) {
          throw createError({
            statusCode: 400,
            message: 'Parent folder not found',
          })
        }

        path = `${parent.path}.${path}`
      }

      const { data, error: insertError } = await supabase
        .from('bookmark_folders')
        .insert({
          ...body,
          user_id: user.id,
          path,
          position: count || 0,
        })
        .select()
        .single()

      if (insertError) throw insertError

      return { data }
    }

    throw createError({
      statusCode: 405,
      message: 'Method not allowed',
    })
  } catch (err) {
    console.error('Folder API Error:', err)

    if (err.statusCode) {
      throw err
    }

    throw createError({
      statusCode: 500,
      message: 'Internal server error',
      cause: err,
    })
  }
})
