// useBookmarkView.ts
import type { Folder } from '../types/bookmarks'

export const useBookmarkView = () => {
  const viewMode = ref<'grid' | 'list'>('grid')
  const searchQuery = ref('')
  const includeSubfolders = ref(true)
  const showFolderPanel = ref(false)
  const showNewFolderModal = ref(false)
  const currentFolder = ref<Folder | null>(null)

  const handleFolderSelect = async (folder: Folder) => {
    currentFolder.value = folder
    const { fetchBookmarks } = useBookmarks()
    await fetchBookmarks({
      folder_id: folder.id,
      include_subfolders: includeSubfolders.value,
    })

    // On mobile, close the folder panel after selection
    if (import.meta.client && window.innerWidth < 768) {
      showFolderPanel.value = false
    }
  }

  const toggleFolderPanel = () => {
    showFolderPanel.value = !showFolderPanel.value
  }

  const debouncedSearch = useDebounceFn((query: string) => {
    // Implement search logic here
    console.log('Searching:', query)
  }, 300)

  watch(searchQuery, (newQuery) => {
    debouncedSearch(newQuery)
  })

  return {
    viewMode,
    searchQuery,
    includeSubfolders,
    showFolderPanel,
    showNewFolderModal,
    currentFolder,
    handleFolderSelect,
    toggleFolderPanel,
  }
}
