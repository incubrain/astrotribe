// useBookmarkManager.ts
import type { Folder } from '../types/bookmarks'

export const useBookmarkManager = () => {
  const selectedBookmarks = ref<string[]>([])
  const showMoveModal = ref(false)
  const targetFolderId = ref<string | null>(null)
  const { moveBookmarks, fetchBookmarks } = useBookmarks()

  const toggleBookmarkSelection = (bookmarkId: string) => {
    const index = selectedBookmarks.value.indexOf(bookmarkId)
    if (index === -1) {
      selectedBookmarks.value.push(bookmarkId)
    } else {
      selectedBookmarks.value.splice(index, 1)
    }
  }

  const handleMoveBookmarks = async () => {
    if (!targetFolderId.value) return

    await moveBookmarks(selectedBookmarks.value, targetFolderId.value)
    selectedBookmarks.value = []
    showMoveModal.value = false
    targetFolderId.value = null
  }

  const handleDeleteBookmark = async (bookmarkId: string | string[]) => {
    const ids = Array.isArray(bookmarkId) ? bookmarkId : [bookmarkId]

    await Promise.all(
      ids.map((id) =>
        $fetch(`/api/bookmarks/${id}`, {
          method: 'DELETE',
        }),
      ),
    )

    await fetchBookmarks({})
    selectedBookmarks.value = selectedBookmarks.value.filter((id) => !ids.includes(id))
  }

  const handleNewFolder = async (folderData: Partial<Folder>) => {
    const { createFolder } = useFolderSystem()
    return await createFolder(folderData)
  }

  const handleMoveSubmit = async (targetFolder: Folder) => {
    targetFolderId.value = targetFolder.id
    await handleMoveBookmarks()
  }

  return {
    selectedBookmarks,
    showMoveModal,
    targetFolderId,
    toggleBookmarkSelection,
    handleMoveBookmarks,
    handleDeleteBookmark,
    handleNewFolder,
    handleMoveSubmit,
  }
}
