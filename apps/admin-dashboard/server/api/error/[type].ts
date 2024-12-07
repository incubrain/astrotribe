import { defineEventHandler, getQuery } from 'h3'
import { serverSupabaseClient } from '#supabase/server'

interface ErrorMetric {
  time_bucket: string
  service_name: string
  error_type: string
  severity: string
  error_count: number
}

interface ErrorPattern {
  error_hash: string
  error_pattern: string
  service_name: string
  occurrence_count: number
  first_seen: string
  last_seen: string
  severity_levels: string[]
  contexts: Record<string, any>[]
  days_active: number
  daily_frequency: number
  is_new: boolean
}

interface ErrorCorrelation {
  source_service: string
  source_pattern: string
  target_service: string
  target_pattern: string
  correlation_count: number
  avg_time_difference: number
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const type = event.context.params?.type

  console.log(`Processing ${type} request with query:`, query)

  const supabase = await serverSupabaseClient(event)

  try {
    switch (type) {
      case 'report': {
        const date = query.date ? new Date(query.date as string) : new Date()
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        console.log('Fetching metrics for date range:', { startOfDay, endOfDay })

        // Get time-based error metrics
        const metricsResponse = await supabase
          .from('error_metrics')
          .select('*')
          .gte('time_bucket', startOfDay.toISOString())
          .lte('time_bucket', endOfDay.toISOString())
          .order('time_bucket', { ascending: false })

        console.log('Metrics query response:', metricsResponse)

        // Get error patterns
        const patternsResponse = await supabase
          .from('error_patterns')
          .select('*')
          .order('occurrence_count', { ascending: false })
          .limit(10)

        console.log('Patterns query response:', patternsResponse)

        // Get error correlations
        const correlationsResponse = await supabase
          .from('error_correlations')
          .select('*')
          .order('correlation_count', { ascending: false })
          .limit(10)

        console.log('Correlations query response:', correlationsResponse)

        const { data: metrics } = metricsResponse
        const { data: patterns } = patternsResponse
        const { data: correlations } = correlationsResponse

        // Calculate time-based metrics
        const timeSeriesData = (metrics || []).reduce((acc: Record<string, number[]>, m) => {
          const hour = new Date(m.time_bucket).getHours()
          acc.hours = acc.hours || Array(24).fill(0)
          acc.hours[hour] += m.error_count
          return acc
        }, {})

        // Calculate severity distribution
        const severityDistribution = (metrics || []).reduce((acc: Record<string, number>, m) => {
          acc[m.severity] = (acc[m.severity] || 0) + m.error_count
          return acc
        }, {})

        // Calculate service distribution
        const serviceDistribution = (metrics || []).reduce((acc: Record<string, number>, m) => {
          acc[m.service_name] = (acc[m.service_name] || 0) + m.error_count
          return acc
        }, {})

        // Calculate error type distribution
        const errorTypeDistribution = (metrics || []).reduce((acc: Record<string, number>, m) => {
          acc[m.error_type] = (acc[m.error_type] || 0) + m.error_count
          return acc
        }, {})

        // Get new pattern count
        const newPatternsCount = (patterns || []).filter((p) => p.is_new).length

        return {
          data: {
            overview: {
              totalErrors: metrics?.reduce((sum, m) => sum + m.error_count, 0) || 0,
              newPatterns: newPatternsCount,
              activeServices: Object.keys(serviceDistribution).length,
              criticalErrors: severityDistribution['critical'] || 0,
            },
            distributions: {
              severity: severityDistribution,
              service: serviceDistribution,
              errorType: errorTypeDistribution,
            },
            trends: {
              hourly: timeSeriesData.hours,
              topPatterns: patterns?.map((p) => ({
                pattern: p.error_pattern,
                service: p.service_name,
                count: p.occurrence_count,
                dailyFrequency: p.daily_frequency,
                isNew: p.is_new,
              })),
              correlations: correlations?.map((c) => ({
                source: `${c.source_service}: ${c.source_pattern}`,
                target: `${c.target_service}: ${c.target_pattern}`,
                count: c.correlation_count,
                avgTimeDiff: c.avg_time_difference,
              })),
            },
          },
        }
      }

      case 'logs': {
        const page = parseInt(query.page as string) || 1
        const pageSize = parseInt(query.pageSize as string) || 50
        const severity = query.severity as string
        const service = query.service as string
        const from = query.from
          ? new Date(query.from as string)
          : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        const to = query.to ? new Date(query.to as string) : new Date()

        console.log('Fetching logs with params:', {
          page,
          pageSize,
          severity,
          service,
          from,
          to,
        })

        let queryBuilder = supabase
          .from('error_logs')
          .select('*', { count: 'exact' })
          .gte('created_at', from.toISOString())
          .lte('created_at', to.toISOString())
          .order('created_at', { ascending: false })

        if (severity) {
          queryBuilder = queryBuilder.eq('severity', severity)
        }
        if (service) {
          queryBuilder = queryBuilder.eq('service_name', service)
        }

        const response = await queryBuilder.range((page - 1) * pageSize, page * pageSize - 1)
        console.log('Logs query response:', response)

        return {
          data: {
            logs: response.data || [],
            total: response.count || 0,
            totalPages: Math.ceil((response.count || 0) / pageSize),
            currentPage: page,
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
