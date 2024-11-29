export const useBookmarkManager = () => {
  const selectedIds = ref<string[]>([])
  const targetFolderId = ref<string | null>(null)
  const { moveBookmarks, fetchBookmarks } = useBookmarkStore()
  const confirm = useConfirm()

  const hasSelection = computed(() => selectedIds.value.length > 0)
  const selectionCount = computed(() => selectedIds.value.length)
  const isSelected = (bookmarkId: string) => computed(() => selectedIds.value.includes(bookmarkId))

  const toggleSelection = (bookmarkId: string) => {
    const index = selectedIds.value.indexOf(bookmarkId)
    if (index === -1) {
      selectedIds.value.push(bookmarkId)
    } else {
      selectedIds.value.splice(index, 1)
    }
  }

  const clearSelection = () => {
    selectedIds.value = []
  }

  const handleMove = async (targetFolder: string) => {
    if (!selectedIds.value.length) return

    try {
      await moveBookmarks(selectedIds.value, targetFolder)
      // Refresh bookmarks
      await fetchBookmarks({})
      // Clear selection
      clearSelection()
    } catch (error) {
      console.error('Failed to move bookmarks:', error)
    }
  }

  const handleDelete = async (bookmarkId: string | string[]) => {
    const ids = Array.isArray(bookmarkId) ? bookmarkId : [bookmarkId]

    try {
      await Promise.all(ids.map((id) => $fetch(`/api/bookmarks/${id}`, { method: 'DELETE' })))
      selectedIds.value = selectedIds.value.filter((id) => !ids.includes(id))
      await fetchBookmarks({})
    } catch (error) {
      console.error('Failed to delete bookmarks:', error)
    }
  }

  return {
    selectedIds,
    targetFolderId,
    hasSelection,
    selectionCount,
    isSelected,
    toggleSelection,
    clearSelection,
    handleMove,
    handleDelete,
  }
}
