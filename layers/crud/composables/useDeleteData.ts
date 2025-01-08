import { useRateLimit } from './useRateLimit'
import consola from 'consola'
import { useHttpHandler } from './useHttpHandler'
import { getOrCreateStore } from './main.store'

export function useDeleteData<T extends { id: string | number }>(
  tableName: string,
  options: {
    validateDelete?: (id: string | number) => boolean | Promise<boolean>
    refreshRelated?: () => Promise<void>
    rateLimitMs?: number
    auditLog?: (action: string, details: any) => Promise<void>
  } = {},
) {
  const { remove } = useHttpHandler()
  const logger = consola
  const store = getOrCreateStore<T>(tableName)()
  const { checkRateLimit } = useRateLimit()
  const isDeleting: Ref<boolean> = ref(false)
  let lastDeleteTime = 0

  const deleteData = async (id: string | number | (string | number)[]) => {
    isDeleting.value = true
    const startTime = Date.now()

    const deleteSingle = async (itemId: string | number): Promise<void> => {
      try {
        // Rate limiting
        if (options.rateLimitMs) {
          await checkRateLimit('useDeleteData', { limitMs: options.rateLimitMs })
        }

        // Validation
        if (options.validateDelete && !(await options.validateDelete(itemId))) {
          throw new Error('Delete not allowed')
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
      logger.error(error, 'Error deleting data')
      throw error
    } finally {
      isDeleting.value = false
    }
  }

  return {
    deleteData,
    isDeleting,
  }
}
