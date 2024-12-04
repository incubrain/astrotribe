import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const query = getQuery(event)
  const type = event.context.params?.type

  const supabase = await serverSupabaseClient(event)

  try {
    switch (type) {
      case 'report': {
        const date = query.date ? new Date(query.date as string) : new Date()
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)

        // Get error metrics for the dashboard
        const { data: metrics } = await supabase
          .from('error_metrics')
          .select('*')
          .gte('time_bucket', startOfDay.toISOString())
          .order('time_bucket', { ascending: false })

        return {
          data: {
            totalErrors: metrics?.reduce((sum, m) => sum + m.error_count, 0) || 0,
            severityDistribution: metrics?.reduce((acc, m) => {
              acc[m.severity] = (acc[m.severity] || 0) + m.error_count
              return acc
            }, {}),
            domainDistribution: metrics?.reduce((acc, m) => {
              acc[m.service_name] = (acc[m.service_name] || 0) + m.error_count
              return acc
            }, {}),
            errorTrends: metrics,
          },
        }
      }

      case 'logs': {
        const page = parseInt(query.page as string) || 1
        const pageSize = parseInt(query.pageSize as string) || 50

        const { data: logs, count } = await supabase
          .from('error_logs')
          .select('*', { count: 'exact' })
          .order('created_at', { ascending: false })
          .range((page - 1) * pageSize, page * pageSize - 1)

        return {
          data: {
            logs,
            total: count,
            totalPages: Math.ceil((count || 0) / pageSize),
          },
        }
      }

      default:
        throw new Error(`Unknown error type: ${type}`)
    }
  } catch (error: any) {
    console.error(`Error fetching ${type} data:`, error)
    throw createError({
      statusCode: error.status || 500,
      statusMessage: error.message || `Error fetching ${type} data`,
    })
  }
})
