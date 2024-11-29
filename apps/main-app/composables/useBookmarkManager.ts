export const useBookmarkManager = () => {
  const selectedIds = ref<string[]>([])
  const targetFolderId = ref<string | null>(null)
  const { moveBookmarks, fetchBookmarks } = useBookmarks()
  const confirm = useConfirm()

  const toggleSelection = (bookmarkId: string) => {
    const index = selectedIds.value.indexOf(bookmarkId)
    if (index === -1) {
      selectedIds.value.push(bookmarkId)
    } else {
      selectedIds.value.splice(index, 1)
    }
  }

  const handleMove = async (targetFolder: string) => {
    if (!selectedIds.value.length) return

    try {
      await moveBookmarks(selectedIds.value, targetFolder)
      // Refresh bookmarks
      await fetchBookmarks({})
      // Clear selection
      selectedIds.value = []
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
    toggleSelection,
    handleMove,
    handleDelete,
  }
}
