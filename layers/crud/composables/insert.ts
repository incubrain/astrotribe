import { useLogger } from '@ib/client'
import { useErrorHandler, AppError, ErrorType, ErrorSeverity } from '@ib/client'
import { useHttpHandler } from './http-handler'
import { getOrCreateStore } from './main.store'
import { useRateLimit } from './rate-limit'

type InsertError =
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'DUPLICATE_ERROR'

export function useInsertData<T extends { id: string | number }>(
  tableName: string,
  options: {
    columns?: string
    validateData?: (data: T) => boolean | Promise<boolean>
    maxRetries?: number
    refreshRelated?: () => Promise<void>
    transformData?: (data: T) => T
    onError?: (error: InsertError, details: any) => void
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
    generateClientId?: () => string | number
  } = {},
) {
  const supabase = useSupabaseClient()
  const { insert } = useHttpHandler()
  const { handleError } = useErrorHandler()
  const log = useLogger('useInsertData')
  const store = getOrCreateStore<T>(tableName)()
  const { checkRateLimit } = useRateLimit()
  const isInserting: Ref<boolean> = ref(false)
  let lastInsertTime = 0

  const insertData = async (data: T | T[]) => {
    isInserting.value = true
    const startTime = Date.now()

    const insertSingle = async (item: T): Promise<T> => {
      try {
        // Rate limiting
        if (options.rateLimitMs) {
          await checkRateLimit('useInsertData', { limitMs: options.rateLimitMs })
        }

        // Validation
        if (options.validateData && !(await options.validateData(item))) {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: 'Data validation failed',
            severity: ErrorSeverity.MEDIUM,
            context: 'Data Validation',
          })
        }

        // Data transformation
        const transformedData = options.transformData ? options.transformData(item) : item

        // Generate client-side ID if needed
        if (options.generateClientId && !transformedData.id) {
          transformedData.id = options.generateClientId()
        }

        // Optimistic insert
        store.addItems([transformedData])

        // Perform the insert
        const result = await insert(tableName, transformedData, { columns: options.columns })

        // Update store with actual server data
        store.updateItem(result)

        // Refresh related data if needed
        if (options.refreshRelated) {
          await options.refreshRelated()
        }

        // Audit logging
        if (options.auditLog) {
          await options.auditLog('INSERT', { tableName, newData: result })
        }

        lastInsertTime = Date.now()
        return result
      } catch (error: any) {
        // Revert optimistic insert
        store.removeItem(item.id)
        throw error // error handler in the HTTP handler deals with this
      }
    }

    try {
      if (Array.isArray(data)) {
        const results = await Promise.all(data.map(insertSingle))
        isInserting.value = false
        return results
      } else {
        const result = await insertSingle(data)
        isInserting.value = false
        return result
      }
    } catch (error: any) {
      handleError(error, 'Error inserting data')
      throw error // Re-throw to allow caller to handle if needed
    } finally {
      isInserting.value = false
    }
  }

  return {
    insertData,
    isInserting,
  }
}
