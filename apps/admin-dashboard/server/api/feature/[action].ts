// server/api/admin/features/[action].ts
import { serverSupabaseClient, serverSupabaseUser } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)
  const user = await serverSupabaseUser(event)
  const action = event.context.params?.action

  if (!user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  // Check if user is admin
  const { data: profile } = await client
    .from('user_profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    throw createError({
      statusCode: 403,
      message: 'Forbidden',
    })
  }

  try {
    switch (action) {
      case 'list': {
        const { data: features, error: listError } = await client
          .from('feature_requests')
          .select('*')
          .order('priority')

        if (listError) throw listError
        return features
      }

      case 'create': {
        const createBody = await readBody(event)
        const { data: newFeature, error: createError } = await client
          .from('feature_requests')
          .insert([createBody])
          .select()
          .single()

        if (createError) throw createError
        return newFeature
      }

      case 'update': {
        const updateBody = await readBody(event)
        const { id, ...updateData } = updateBody
        const { data: updatedFeature, error: updateError } = await client
          .from('feature_requests')
          .update(updateData)
          .eq('id', id)
          .select()
          .single()

        if (updateError) throw updateError
        return updatedFeature
      }

      case 'delete': {
        const deleteBody = await readBody(event)
        const { error: deleteError } = await client
          .from('feature_requests')
          .delete()
          .eq('id', deleteBody.id)

        if (deleteError) throw deleteError
        return { success: true }
      }

      default:
        throw createError({
          statusCode: 400,
          message: 'Invalid action',
        })
    }
  } catch (error) {
    console.error(`Admin features API error (${action}):`, error)
    throw createError({
      statusCode: 500,
      message: 'Failed to process request',
    })
  }
})
