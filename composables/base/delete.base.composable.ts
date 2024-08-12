import {
  useErrorHandler,
  AppError,
  ErrorSeverity,
  ErrorType
} from './error-handler.base.composable'
import { useHttpHandler } from './http-handler.base.composable'
import { useLogger } from './logger.base.composable'
import { getOrCreateStore } from './utils.base.composable'

export function useDeleteData<T extends { id: string | number }>(
  tableName: string,
  options: {
    validateDelete?: (id: string | number) => boolean | Promise<boolean>
    refreshRelated?: () => Promise<void>
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
  } = {}
) {
  const { remove } = useHttpHandler()
  const { handleError } = useErrorHandler()
  const logger = useLogger('useDeleteData')
  const store = getOrCreateStore<T>(tableName)()
  const isDeleting: Ref<boolean> = ref(false)
  let lastDeleteTime = 0

  const deleteData = async (id: string | number | (string | number)[]) => {
    isDeleting.value = true
    const startTime = Date.now()

    const deleteSingle = async (itemId: string | number): Promise<void> => {
      try {
        // Rate limiting
        if (options.rateLimitMs) {
          const timeSinceLastDelete = startTime - lastDeleteTime
          if (timeSinceLastDelete < options.rateLimitMs) {
            await new Promise((resolve) =>
              setTimeout(resolve, options.rateLimitMs ?? 0 - timeSinceLastDelete)
            )
          }
        }

        // Validation
        if (options.validateDelete && !(await options.validateDelete(itemId))) {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: 'Delete validation failed',
            severity: ErrorSeverity.MEDIUM,
            context: 'Data Validation'
          })
        }

        // Optimistic delete
        store.removeItem(itemId)

        // Perform the delete
        await remove(tableName, itemId)

        // Refresh related data if needed
        if (options.refreshRelated) {
          await options.refreshRelated()
        }

        // Audit logging
        if (options.auditLog) {
          await options.auditLog('DELETE', { tableName, id: itemId })
        }

        lastDeleteTime = Date.now()
      } catch (error: any) {
        // Revert optimistic delete
        const oldItem = store.getItemById(itemId)
        if (oldItem) {
          store.addItems([oldItem])
        }
        throw error
      }
    }

    try {
      if (Array.isArray(id)) {
        await Promise.all(id.map(deleteSingle))
      } else {
        await deleteSingle(id)
      }
    } catch (error: any) {
      handleError(error, 'Error deleting data')
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteData,
    isDeleting
  }
}
