import { useConfirm } from 'primevue/useconfirm'
import { useErrorHandler } from '@ib/logger'
import type { Folder } from '~/types/folder'

export const useFolderSystem = () => {
  const confirm = useConfirm()

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
      // First get the default folder
      const defaultFolder = getDefaultFolder.value
      if (!defaultFolder) {
        throw new Error('Default folder not found')
      }

      // Show confirmation dialog
      return new Promise((resolve) => {
        confirm.require({
          message: 'What would you like to do with the bookmarks in this folder?',
          header: 'Delete Folder',
          icon: 'pi pi-exclamation-triangle',
          acceptLabel: 'Delete all bookmarks',
          rejectLabel: 'Move to default folder',
          accept: async () => {
            try {
              const response = await $fetch(`/api/folders/${folderId}`, {
                method: 'DELETE',
                body: {
                  strategy: 'delete_all',
                },
              })

              const data = errorHandler.handleFetchError({
                response,
                devMessage: `Failed to delete folder ${folderId}`,
                userMessage: 'Unable to delete folder',
              })

              if (data !== null) {
                await fetchFolders()
              }
              resolve(true)
            } catch (error) {
              errorHandler.handleError(error, {
                context: 'deleteFolder',
                userMessage: 'Failed to delete folder',
              })
              resolve(false)
            } finally {
              loading.value = false
            }
          },
          reject: async () => {
            // Move to default folder
            const result = await handleMoveAndDelete(folderId, defaultFolder.id)
            resolve(result)
          },
        })
      })
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'deleteFolder',
        userMessage: 'Failed to delete folder',
      })
      loading.value = false
      return false
    }
  }

  const handleMoveAndDelete = async (folderId: string, defaultFolderId: string) => {
    try {
      const response = await $fetch(`/api/folders/${folderId}`, {
        method: 'DELETE',
        body: {
          strategy: 'move_to_default',
          defaultFolderId,
        },
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
        context: 'handleMoveAndDelete',
        userMessage: 'Failed to move bookmarks and delete folder',
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
