// server/api/error-logs.get.ts
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const logger = useServerLogger('error-logs')
  const supabase = await serverSupabaseClient(event)

  logger.error('Fetching error logs')

  return logger.handleQuery(async () => {
    const { from, to } = getQuery(useEvent())
    const query = supabase
      .from('error_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50)

    // Only add date filters if they are defined
    if (from) {
      query.gte('created_at', from as string)
    }

    if (to) {
      query.lte('created_at', to as string)
    }

    return query
  })
})
