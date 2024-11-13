// useFolderSystem.ts

import { useErrorHandler } from '@ib/logger'
import type { Folder } from '@/types/folder'

export const useFolderSystem = () => {
  const maxFolderDepth = 5
  const errorHandler = useErrorHandler('FolderSystem')

  const folders = ref<Folder[]>([])
  const flatFolders = ref<Folder[]>([])
  const loading = ref(false)

  const buildFolderTree = (items: Folder[]): Folder[] => {
    if (!items?.length) return []

    try {
      // Filter out duplicate default folders, keep only the first one
      const uniqueItems = items.reduce((acc, curr) => {
        if (curr.is_default) {
          if (!acc.some((item) => item.is_default)) {
            acc.push(curr)
          }
        } else {
          acc.push(curr)
        }
        return acc
      }, [] as Folder[])

      const itemMap = new Map<string, Folder & { children: Folder[] }>()

      // First pass: Create map entries with empty children arrays
      items.forEach((item) => {
        itemMap.set(item.id, { ...item, children: [] })
      })

      const tree: Folder[] = []

      // Second pass: Build tree structure
      items.forEach((item) => {
        const node = itemMap.get(item.id)
        if (!node) return

        if (item.parent_id) {
          const parent = itemMap.get(item.parent_id)
          if (parent) {
            parent.children.push(node)
          } else {
            tree.push(node)
          }
        } else {
          tree.push(node)
        }
      })

      // Sort folders
      const sortFolders = (items: Folder[]) => {
        items.sort((a, b) => {
          if (a.is_favorite !== b.is_favorite) return b.is_favorite ? 1 : -1
          return a.position - b.position
        })
        items.forEach((item) => {
          if (item.children?.length) {
            sortFolders(item.children)
          }
        })
      }

      sortFolders(tree)
      return tree
    } catch (err) {
      console.error('Error building folder tree:', err)
      return []
    }
  }

  const fetchFolders = async () => {
    loading.value = true
    try {
      const response = await $fetch('/api/folders')
      const data = errorHandler.handleFetchError({
        response,
        devMessage: 'Failed to fetch folders',
        userMessage: 'Unable to load folders',
      })

      flatFolders.value = data || []
      folders.value = buildFolderTree(data || [])
      return data
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'fetchFolders',
        userMessage: 'Failed to load folders',
      })
      flatFolders.value = []
      folders.value = []
      return null
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

  const moveFolder = async (folderId: string, targetParentId: string | null) => {
    loading.value = true
    try {
      const response = await $fetch(`/api/folders/${folderId}/move`, {
        method: 'PATCH',
        body: { parent_id: targetParentId },
      })
      const data = errorHandler.handleFetchError({
        response,
        devMessage: `Failed to move folder ${folderId}`,
        userMessage: 'Unable to move folder',
      })

      if (data) {
        await fetchFolders()
      }
      return data
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'moveFolder',
        userMessage: 'Failed to move folder',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  const reorderFolders = async (folderIds: string[]) => {
    loading.value = true
    try {
      const response = await $fetch('/api/folders/reorder', {
        method: 'PATCH',
        body: { folderIds },
      })
      const data = errorHandler.handleFetchError({
        response,
        devMessage: 'Failed to reorder folders',
        userMessage: 'Unable to reorder folders',
      })

      if (data) {
        await fetchFolders()
      }
      return data
    } catch (error) {
      errorHandler.handleError(error, {
        context: 'reorderFolders',
        userMessage: 'Failed to reorder folders',
      })
      return null
    } finally {
      loading.value = false
    }
  }

  // Computed properties
  const getDefaultFolder = computed(() => flatFolders.value.find((f) => f.is_default) || null)

  const getFavorites = computed(() => flatFolders.value.filter((f) => f.is_favorite) || [])

  // Validation helpers
  const canCreateFolder = (parentId: string | null): boolean => {
    if (!parentId) return true

    const parent = flatFolders.value.find((f) => f.id === parentId)
    if (!parent) return false

    const depth = (parent.path.match(/\./g) || []).length
    return depth < maxFolderDepth
  }

  const validateFolderOperation = (folderId: string, targetFolderId: string): boolean => {
    const folder = flatFolders.value.find((f) => f.id === folderId)
    const targetFolder = flatFolders.value.find((f) => f.id === targetFolderId)

    if (!folder || !targetFolder) return false
    return !targetFolder.path.startsWith(folder.path)
  }

  const getFolderDescendants = (folderId: string): string[] => {
    const folder = flatFolders.value.find((f) => f.id === folderId)
    if (!folder) return []

    return flatFolders.value.filter((f) => f.path.startsWith(folder.path)).map((f) => f.id)
  }

  // Initialize folders
  onMounted(() => {
    fetchFolders()
  })

  return {
    folders,
    flatFolders,
    loading,
    fetchFolders,
    createFolder,
    updateFolder,
    deleteFolder,
    moveFolder,
    reorderFolders,
    getDefaultFolder,
    getFavorites,
    canCreateFolder,
    validateFolderOperation,
    getFolderDescendants,
  }
}
