import { useErrorHandler } from '@ib/logger'
import type { Folder } from '~/types/folder'

export const useFolderSystem = () => {
  const folders = ref<Folder[]>([])
  const loading = ref(false)
  const errorHandler = useErrorHandler('FolderSystem')

  const fetchFolders = async () => {
    loading.value = true
    try {
      const response = await $fetch('/api/folders')
      const data = errorHandler.handleFetchError({
        response,
        devMessage: 'Failed to fetch folders',
        userMessage: 'Unable to load folders',
      })
      folders.value = data || []
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'fetchFolders',
        userMessage: 'Failed to load folders',
      })
      folders.value = []
    } finally {
      loading.value = false
    }
  }

  const createFolder = async (folder: Partial<Folder>) => {
    loading.value = true
    try {
      const response = await $fetch('/api/folders', {
        method: 'POST',
        body: folder,
      })
      const data = errorHandler.handleFetchError({
        response,
        devMessage: 'Failed to create folder',
        userMessage: 'Unable to create folder',
      })
      if (data) {
        await fetchFolders()
      }
      return data
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'createFolder',
        userMessage: 'Failed to create folder',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const updateFolder = async (folderId: string, updates: Partial<Folder>) => {
    loading.value = true
    try {
      const response = await $fetch(`/api/folders/${folderId}`, {
        method: 'PATCH',
        body: updates,
      })
      const data = errorHandler.handleFetchError({
        response,
        devMessage: `Failed to update folder ${folderId}`,
        userMessage: 'Unable to update folder',
      })
      if (data) {
        await fetchFolders()
      }
      return data
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'updateFolder',
        userMessage: 'Failed to update folder',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const deleteFolder = async (folderId: string) => {
    loading.value = true
    try {
      const response = await $fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
      })
      const data = errorHandler.handleFetchError({
        response,
        devMessage: `Failed to delete folder ${folderId}`,
        userMessage: 'Unable to delete folder',
      })
      if (data !== null) {
        await fetchFolders()
      }
      return true
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'deleteFolder',
        userMessage: 'Failed to delete folder',
      })
      return false
    } finally {
      loading.value = false
    }
  }

  // Initialize folders
  onMounted(() => {
    fetchFolders()
  })

  // Computed properties for convenience
  const getDefaultFolder = computed(() => folders.value.find((f) => f.is_default) || null)
  const getFavorites = computed(() => folders.value.filter((f) => f.is_favorite) || [])

  return {
    folders,
    loading,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    getDefaultFolder,
    getFavorites,
  }
}
