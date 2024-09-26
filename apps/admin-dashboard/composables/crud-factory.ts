import { useUpdateData } from '../../../layers/base/composables/update'
import { useSelectData } from '../../../layers/base/composables/select'
import { useDeleteData } from '../../../layers/base/composables/delete'
import { useInsertData } from '../../../layers/base/composables/insert'
import {
  useErrorHandler,
  AppError,
  ErrorType,
  ErrorSeverity,
} from '../../../layers/base/composables/error-handler'

export interface CRUDOptions<T> {
  initialFetch?: boolean
  orderBy?: { column: keyof T, ascending: boolean }
  limit?: number
  customSelectLogic?: (data: T[]) => T[]
  validateInsert?: (data: Omit<T, 'id'>) => boolean | Promise<boolean>
  validateUpdate?: (data: Partial<T>) => boolean | Promise<boolean>
  validateDelete?: (id: string | number) => boolean | Promise<boolean>
  afterInsert?: (insertedItem: T) => void | Promise<void>
  afterUpdate?: (updatedItem: T) => void | Promise<void>
  afterDelete?: (deletedId: string | number) => void | Promise<void>
}

export function createCRUDComposable<T extends { id: string | number }>(
  entityName: string,
  options: CRUDOptions<T> = {},
) {
  return function () {
    const { store, isSelecting, loadMore } = useSelectData<T>(entityName, {
      initialFetch: options.initialFetch ?? true,
      orderBy: options.orderBy as any,
      limit: options.limit ?? 100,
    })

    const { insertData, isInserting } = useInsertData<T>(entityName)
    const { updateData, isUpdating } = useUpdateData<T>(entityName)
    const { deleteData, isDeleting } = useDeleteData<T>(entityName)
    const { handleError } = useErrorHandler()

    const entities = computed(() => {
      const data = store.items
      return options.customSelectLogic ? options.customSelectLogic(data as T[]) : data
    })

    const isLoading = computed(() => isSelecting.value || isUpdating.value || isDeleting.value)

    const fetchEntities = async () => {
      try {
        await loadMore()
      } catch (error: any) {
        handleError(error, `Error fetching ${entityName}`)
      }
    }

    const insertEntity = async (data: Omit<T, 'id'>) => {
      try {
        if (options.validateInsert && !(await options.validateInsert(data))) {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: 'Insert validation failed',
            severity: ErrorSeverity.MEDIUM,
            stack: 'no stack',
            context: `${entityName} insert`,
          })
        }
        const insertedItem = (await insertData(data as T)) as T
        if (options.afterInsert) {
          await options.afterInsert(insertedItem)
        }
        await fetchEntities() // Refresh the list after insertion
        return insertedItem
      } catch (error: any) {
        handleError(error, `Error inserting ${entityName}`)
        throw error
      }
    }

    const updateEntity = async (id: string | number, data: Partial<T>) => {
      try {
        if (options.validateUpdate && !(await options.validateUpdate(data))) {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: 'Update validation failed',
            severity: ErrorSeverity.MEDIUM,
            context: `${entityName} update`,
            stack: 'no stack',
          })
        }
        const updatedItem = await updateData(id, data)
        if (options.afterUpdate) {
          await options.afterUpdate(updatedItem)
        }
        return updatedItem
      } catch (error: any) {
        handleError(error, `Error updating ${entityName}`)
        throw error
      }
    }

    const deleteEntity = async (id: string | number) => {
      try {
        if (options.validateDelete && !(await options.validateDelete(id))) {
          throw new AppError({
            type: ErrorType.VALIDATION_ERROR,
            message: 'Delete validation failed',
            severity: ErrorSeverity.MEDIUM,
            context: `${entityName} delete`,
            stack: 'no stack',
          })
        }
        await deleteData(id)
        if (options.afterDelete) {
          await options.afterDelete(id)
        }
        await fetchEntities() // Refresh the list after deletion
      } catch (error: any) {
        handleError(error, `Error deleting ${entityName}`)
        throw error
      }
    }

    return {
      entities,
      isLoading,
      insertEntity,
      fetchEntities,
      updateEntity,
      deleteEntity,
    }
  }
}
