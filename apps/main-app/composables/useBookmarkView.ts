// useBookmarkView.ts
import type { Folder } from '../types/bookmarks'

export const useBookmarkView = () => {
  const viewMode = ref<'grid' | 'list'>('grid')
  const searchQuery = ref('')
  const includeSubfolders = ref(true)
  const showNewFolderModal = ref(false)

  const handleFolderSelect = async (folder: Folder) => {
    const { fetchBookmarks } = useBookmarkStore()
    await fetchBookmarks({
      folder_id: folder.id,
      include_subfolders: includeSubfolders.value,
    })
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
    showNewFolderModal,
    handleFolderSelect,
  }
}
