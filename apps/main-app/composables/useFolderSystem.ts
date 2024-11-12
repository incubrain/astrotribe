export interface Folder {
  id: string
  name: string
  color: string
  parent_id: string | null
  is_default: boolean
  is_favorite: boolean
  position: number
  path: string
  children?: Folder[]
}

export const useFolderSystem = () => {
  const maxFolderDepth = 5

  const folders = ref<Folder[]>([])
  const flatFolders = ref<Folder[]>([])
  const loading = ref(false)

  const validateFolderOperation = (folderId: string, targetFolderId: string) => {
    // Prevent moving folder into itself or its children
    const folder = flatFolders.value.find((f) => f.id === folderId)
    const targetFolder = flatFolders.value.find((f) => f.id === targetFolderId)

    if (!folder || !targetFolder) return false

    // Check if target is a child of the folder
    return !targetFolder.path.startsWith(folder.path)
  }

  const getFolderDescendants = (folderId: string): string[] => {
    const folder = flatFolders.value.find((f) => f.id === folderId)
    if (!folder) return []

    return flatFolders.value.filter((f) => f.path.startsWith(folder.path)).map((f) => f.id)
  }

  const canCreateFolder = (parentId: string | null) => {
    if (!parentId) return true

    const parent = flatFolders.value.find((f) => f.id === parentId)
    if (!parent) return false

    // Count dots in path to determine depth
    const currentDepth = (parent.path.match(/\./g) || []).length
    return currentDepth < maxFolderDepth
  }

  const buildFolderTree = (items: Folder[]) => {
    const itemMap = new Map(items.map((item) => [item.id, { ...item, children: [] }]))
    const tree: Folder[] = []

    for (const item of itemMap.values()) {
      if (item.parent_id) {
        const parent = itemMap.get(item.parent_id)
        if (parent) {
          parent.children = parent.children || []
          parent.children.push(item)
        }
      } else {
        tree.push(item)
      }
    }

    // Sort by position and favorites first
    const sortFolders = (items: Folder[]) => {
      items.sort((a, b) => {
        if (a.is_favorite !== b.is_favorite) return b.is_favorite ? 1 : -1
        return a.position - b.position
      })
      items.forEach((item) => {
        if (item.children) sortFolders(item.children)
      })
    }

    sortFolders(tree)
    return tree
  }

  const fetchFolders = async () => {
    loading.value = true
    try {
      const { data } = await useFetch('/api/folders')
      flatFolders.value = data.value || []
      folders.value = buildFolderTree(data.value || [])
    } finally {
      loading.value = false
    }
  }

  const updateFolder = async (folderId: string, updates: Partial<Folder>) => {
    const { data } = await useFetch(`/api/folders/${folderId}`, {
      method: 'PATCH',
      body: updates,
    })
    await fetchFolders()
    return data.value
  }

  const createFolder = async (folder: Partial<Folder>) => {
    const { data } = await useFetch('/api/folders', {
      method: 'POST',
      body: folder,
    })
    await fetchFolders()
    return data.value
  }

  const getDefaultFolder = computed(() => flatFolders.value.find((f) => f.is_default))

  const getFavorites = computed(() => flatFolders.value.filter((f) => f.is_favorite))

  return {
    folders,
    flatFolders,
    loading,
    fetchFolders,
    updateFolder,
    createFolder,
    getDefaultFolder,
    getFavorites,
  }
}
