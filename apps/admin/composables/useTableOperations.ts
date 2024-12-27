// composables/useTableOperations.ts
import { ref, type Ref } from 'vue'

export function useTableOperations(data: Ref<any[]>, tableName: string) {
  const store = useAdminTablesStore()
  const logger = useLogger('admin')
  const { execute } = useOptimisticUpdate()

  // State
  const selectedRows = ref<any[]>([])
  const deleteDialogVisible = ref(false)
  const newRowDialogVisible = ref(false)
  const loading = ref(false)

  // Delete operations
  const handleBulkDelete = async () => {
    const ids = selectedRows.value.map((row) => row.id)
    const oldData = [...data.value]

    await execute({
      key: `bulk-delete-${tableName}`,
      optimisticUpdate: () => {
        data.value = data.value.filter((row) => !ids.includes(row.id))
        selectedRows.value = []
        deleteDialogVisible.value = false
      },
      rollback: () => {
        data.value = oldData
        selectedRows.value = []
        deleteDialogVisible.value = false
      },
      apiCall: () => store.deleteRecords(tableName, ids),
    })
  }

  const confirmDelete = () => {
    if (selectedRows.value.length === 0) {
      logger.warn('Attempted to delete with no rows selected', { tableName })
      return
    }
    deleteDialogVisible.value = true
  }

  // Add operations
  const openNewRowDialog = () => {
    newRowDialogVisible.value = true
    logger.info('Opening new row dialog', { tableName })
  }

  const closeNewRowDialog = () => {
    newRowDialogVisible.value = false
    logger.info('Closing new row dialog', { tableName })
  }

  const onRowAdded = async (newRow: any) => {
    try {
      const result = await store.insertRecord(tableName, newRow)
      data.value = [...data.value, result]
      logger.info('Row added successfully', { tableName })
    } catch (error: any) {
      logger.error('Error adding row:', { error })
    }
  }

  // Edit operations
  const onRowEditSave = async (event: { newData: any; index: number }) => {
    try {
      const result = await store.updateRecord(tableName, event.newData)
      data.value[event.index] = result
      logger.info('Row updated successfully', { tableName })
      return true
    } catch (error: any) {
      logger.error('Error updating row:', { error })
      return false
    }
  }

  // Selection operations
  const onSelectionChange = (newSelection: any[]) => {
    selectedRows.value = newSelection
    logger.debug('Selection changed', {
      tableName,
      selectedCount: newSelection.length,
    })
  }

  const clearSelection = () => {
    selectedRows.value = []
    logger.info('Selection cleared', { tableName })
  }

  const onSelectAll = (allRows: any[]) => {
    selectedRows.value = allRows
    logger.info('All rows selected', {
      tableName,
      count: allRows.length,
    })
  }

  // Refresh operations
  const refreshData = async () => {
    loading.value = true
    try {
      const freshData = await store.fetchTableData(tableName)
      data.value = freshData
      clearSelection()
      logger.info('Data refreshed successfully', { tableName })
    } catch (error: any) {
      logger.error('Error refreshing data:', { error })
    } finally {
      loading.value = false
    }
  }

  // Cleanup
  onBeforeUnmount(() => {
    clearSelection()
    closeNewRowDialog()
  })

  return {
    // State
    selectedRows,
    deleteDialogVisible,
    newRowDialogVisible,
    loading,

    // Delete operations
    handleBulkDelete,
    confirmDelete,

    // Add operations
    openNewRowDialog,
    closeNewRowDialog,
    onRowAdded,

    // Edit operations
    onRowEditSave,

    // Selection operations
    onSelectionChange,
    clearSelection,
    onSelectAll,

    // Refresh operations
    refreshData,
  }
}
