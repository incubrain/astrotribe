import { useErrorHandler, AppError, ErrorSeverity, ErrorType, useLogger } from '@ib/logger'
import { useHttpHandler } from './http-handler'
import { getOrCreateStore } from './main.store'
import { useRateLimit } from './rate-limit'

export function useUpdateData<T extends { id: string | number }>(
  tableName: string,
  options: {
    columns?: string
    validateData?: (data: Partial<T>) => boolean | Promise<boolean>
    refreshRelated?: () => Promise<void>
    transformData?: (data: Partial<T>) => Partial<T>
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
  } = {},
) {
  const { update } = useHttpHandler()
  const { handleError } = useErrorHandler()
  const logger = useLogger('useUpdateData')
  const store = getOrCreateStore<T>(tableName)()
  const { checkRateLimit } = useRateLimit()

  const isUpdating: Ref<boolean> = ref(false)
  let lastUpdateTime = 0

  const updateData = async (id: string | number, data: Partial<T>) => {
    isUpdating.value = true
    const startTime = Date.now()
    let oldData: T | undefined = undefined

    try {
      // Rate limiting
      if (options.rateLimitMs) {
        await checkRateLimit('useUpdateData', { limitMs: options.rateLimitMs })
      }

      // Validation
      if (options.validateData && !(await options.validateData(data))) {
        throw new AppError({
          type: ErrorType.VALIDATION_ERROR,
          message: 'Data validation failed',
          severity: ErrorSeverity.MEDIUM,
          context: 'Data Validation',
        })
      }

      // Data transformation
      const transformedData = options.transformData ? options.transformData(data) : data

      // Optimistic update
      oldData = store.getItemById(id)
      if (!oldData) {
        throw new AppError({
          type: ErrorType.NOT_FOUND_ERROR,
          message: 'Item not found in store',
          severity: ErrorSeverity.MEDIUM,
          context: 'Data Update',
        })
      }
      store.updateItem({ ...oldData, ...transformedData, id })

      // Perform the update
      const result = await update(tableName, id, transformedData, { columns: options.columns })

      // Update store with actual server data
      store.updateItem(result)

      // Refresh related data if needed
      if (options.refreshRelated) {
        await options.refreshRelated()
      }

      // Audit logging
      if (options.auditLog) {
        await options.auditLog('UPDATE', { tableName, id, oldData, newData: result })
      }

      lastUpdateTime = Date.now()
      return result
    } catch (error: any) {
      // Revert optimistic update
      if (oldData) {
        store.updateItem(oldData)
      }
      handleError(error, 'Error updating data')
      throw error
    } finally {
      isUpdating.value = false
    }
  }

  return {
    updateData,
    isUpdating,
  }
}
