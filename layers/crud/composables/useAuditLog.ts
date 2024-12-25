export enum AuditLogLevel {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

export interface AuditLogEntry {
  userId: string
  action: string
  details: any
  level: AuditLogLevel
  timestamp: string
  ipAddress?: string
  userAgent?: string
  resourceId?: string
  resourceType?: string
}

interface AuditLogOptions {
  level?: AuditLogLevel
  resourceId?: string
  resourceType?: string
  skipDB?: boolean
}

export function useAuditLog() {
  const supabase = useSupabaseClient()
  const user = useSupabaseUser()
  const config = useRuntimeConfig()

  const logEvent = async (action: string, details: any, options: AuditLogOptions = {}) => {
    const userId = user.value?.id || 'anonymous'
    const timestamp = new Date().toISOString()
    const level = options.level || AuditLogLevel.INFO

    const logEntry: AuditLogEntry = {
      userId,
      action,
      details,
      level,
      timestamp,
      ipAddress: useRequestHeaders(['x-forwarded-for'])['x-forwarded-for'] || '',
      userAgent: useRequestHeaders(['user-agent'])['user-agent'] || '',
      resourceId: options.resourceId,
      resourceType: options.resourceType,
    }

    // Remove any sensitive information from the log entry
    sanitizeLogEntry(logEntry)

    // Log to console in development
    if (import.meta.dev) {
      console.log('Audit Log:', logEntry)
    }

    if (!options.skipDB) {
      try {
        const { error } = await supabase.from('audit_logs').insert(logEntry)

        if (error: any) {
          console.error('Error logging audit event to database:', error)
        }
      } catch (error: any) {
        console.error('Error logging audit event to database:', error)
      }
    }

    // If configured, send logs to an external service
    if (config.public.EXTERNAL_LOGGING_SERVICE) {
      try {
        await $fetch(config.public.EXTERNAL_LOGGING_SERVICE, {
          method: 'POST',
          body: JSON.stringify(logEntry),
        })
      } catch (error: any) {
        console.error('Error sending log to external service:', error)
      }
    }
  }

  const sanitizeLogEntry = (logEntry: AuditLogEntry) => {
    // Remove sensitive information like passwords, tokens, etc.
    if (logEntry.details && typeof logEntry.details === 'object') {
      const sensitiveFields = ['password', 'token', 'secret', 'credit_card']
      for (const field of sensitiveFields) {
        if (field in logEntry.details) {
          logEntry.details[field] = '[REDACTED]'
        }
      }
    }
  }

  const getAuditLogs = async (
    filters: Partial<AuditLogEntry>,
    pagination: { page: number; pageSize: number },
  ) => {
    let query = supabase.from('audit_logs').select('*')

    // Apply filters
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        query = query.eq(key, value)
      }
    })

    // Apply pagination
    const { data, error, count } = await query
      .range(pagination.page * pagination.pageSize, (pagination.page + 1) * pagination.pageSize - 1)
      .order('timestamp', { ascending: false })

    if (error: any) {
      console.error('Error fetching audit logs:', error)
      throw error
    }

    return { logs: data, totalCount: count }
  }

  return {
    logEvent,
    getAuditLogs,
    AuditLogLevel,
  }
}
