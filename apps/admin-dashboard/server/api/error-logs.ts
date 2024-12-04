// server/api/error-logs.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)

  const supabase = await serverSupabaseClient(event)

  try {
    const { from, to } = query

    let queryBuilder = supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    if (from) {
      queryBuilder = queryBuilder.gte('created_at', from as string)
    }

    if (to) {
      queryBuilder = queryBuilder.lte('created_at', to as string)
    }

    const { data: logs, error } = await queryBuilder

    if (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to fetch error logs',
        message: error.message,
      })
    }

    return {
      data: logs,
    }
  } catch (error: any) {
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch error logs',
      message: error.message,
    })
  }
})
