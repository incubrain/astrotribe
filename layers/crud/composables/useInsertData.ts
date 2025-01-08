import { useHttpHandler } from './useHttpHandler'
import { getOrCreateStore } from './main.store'
import { useRateLimit } from './useRateLimit'

type InsertError =
  | 'VALIDATION_ERROR'
  | 'NETWORK_ERROR'
  | 'SERVER_ERROR'
  | 'RATE_LIMIT_ERROR'
  | 'DUPLICATE_ERROR'

function generateTemporaryId(): string {
  return `temp_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
}

export function useInsertData<T extends { id?: string | number }>(
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
  const log = useLogger('useInsertData')
  const store = getOrCreateStore<T>(tableName)()
  const { checkRateLimit } = useRateLimit()
  const isInserting: Ref<boolean> = ref(false)
  let lastInsertTime = 0

  const insertData = async (data: T | T[]) => {
    isInserting.value = true
    const startTime = Date.now()

    async function insertSingle(item: T): Promise<T> {
      let transformedData: T | null = null
      try {
        // Rate limiting
        if (options.rateLimitMs) {
          await checkRateLimit('useInsertData', { limitMs: options.rateLimitMs })
        }

        // Data transformation
        transformedData = options.transformData ? options.transformData(item) : item

        // Generate client-side ID if needed
        if (!transformedData.id) {
          transformedData.id = options.generateClientId
            ? options.generateClientId()
            : generateTemporaryId()
        }

        // Optimistic insert
        store.addItems([transformedData])

        // Perform the insert
        const result = await insert(tableName, transformedData, { columns: options.columns })

        // Update store with actual server data
        store.updateItem(result)

        // Validation
        if (options.validateData && !(await options.validateData(item))) {
          throw new Error({
            type: 'VALIDATION_ERROR',
            message: 'Data validation failed',
            severity: 'MEDIUM',
            context: 'Data Validation',
          })
        }

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
        if (transformedData && transformedData.id) {
          store.removeItem(transformedData.id)
        }
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
      logger.error(error, { userMessage: 'Error inserting data' })
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
