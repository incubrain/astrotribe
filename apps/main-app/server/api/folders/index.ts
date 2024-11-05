import { validateFeatureLimit } from '../../utils/featureLimits'
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

  if (event.method === 'GET') {
    return await supabase
      .from('bookmark_folders')
      .select('*')
      .eq('user_id', user.id)
      .order('position')
  }

  if (event.method === 'POST') {
    try {
      const { count } = await supabase
        .from('bookmark_folders')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)

      // Validate feature limit
      await validateFeatureLimit(event, 'BOOKMARK_FOLDERS', count)
      const body = await readBody(event)

      // If creating a default folder, remove default from others
      if (body.is_default) {
        await supabase
          .from('bookmark_folders')
          .update({ is_default: false })
          .eq('user_id', user.id)
          .eq('is_default', true)
      }

      // Calculate path for nested folders
      let path = body.name.toLowerCase().replace(/\s+/g, '_')
      if (body.parent_id) {
        const parent = await supabase
          .from('bookmark_folders')
          .select('path')
          .eq('id', body.parent_id)
          .single()
        path = `${parent.path}.${path}`
      }

      return await supabase
        .from('bookmark_folders')
        .insert({
          ...body,
          user_id: user.id,
          path,
        })
        .select()
        .single()
    } catch (error) {
      if (error.statusCode === 403) {
        throw createError({
          statusCode: 403,
          message: error.message,
        })
      }
      throw error
    }
  }
})
