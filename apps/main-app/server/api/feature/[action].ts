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

  switch (action) {
    case 'list': {
      const { data: features, error: listError } = await client
        .from('feature_requests')
        .select('*')
        .order('priority')

      if (listError) throw createError({ statusCode: 500, message: listError.message })
      return features
    }

    case 'rank': {
      const body = await readBody(event)
      const { rankings } = body

      const { error: rankError } = await client.from('feature_votes').upsert(
        {
          user_id: user.id,
          rankings: rankings,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'user_id',
        },
      )

      if (rankError) throw createError({ statusCode: 500, message: rankError.message })
      return { success: true }
    }

    default:
      throw createError({
        statusCode: 400,
        message: 'Invalid action',
      })
  }
})
