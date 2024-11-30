// useBookmarkStore.ts
import { defineStore } from 'pinia'
import Fuse from 'fuse.js'

interface BookmarkContent {
  id: string
  type: string
  title: string
  description?: string
  thumbnail?: string
  url?: string
  author?: string
  folder_id?: string
}

interface BookmarkParams {
  content_type?: string
  folder_id?: string
  include_subfolders?: boolean
}

interface Bookmark {
  id: string
  user_id: string
  folder_id: string | null
  content_type: string
  content_id: string
  metadata: {
    title: string
    author?: string
    description?: string
    thumbnail?: string
    url?: string
  }
  created_at: string
  folder?: {
    id: string
    name: string
    color: string
    is_favorite: boolean
  }
}

// stores/useBookmarkStore.ts
export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref<Bookmark[]>([])
  const bookmarksByFolder = ref<Map<string, Bookmark[]>>(new Map())

  const folderBookmarkCounts = ref<Record<string, number>>({})

  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentFolderId = ref<string | null>(null)
  const includeSubfolders = ref(true)
  const searchQuery = ref('')

  const organizeBookmarksByFolder = (bookmarksList: Bookmark[]) => {
    const folderMap = new Map<string, Bookmark[]>()

    bookmarksList.forEach((bookmark) => {
      const folderId = bookmark.folder_id || 'uncategorized'
      if (!folderMap.has(folderId)) {
        folderMap.set(folderId, [])
      }
      folderMap.get(folderId)?.push(bookmark)
    })

    bookmarksByFolder.value = folderMap
  }

  // Get bookmark count for a folder
  const fetchBookmarkCounts = async () => {
    try {
      console.log('Fetching bookmark counts...')
      const response = await $fetch('/api/bookmarks/counts')
      console.log('Bookmark counts response:', response)

      if (!response?.data) {
        console.error('No data received from bookmark counts endpoint')
        return
      }

      const oldCounts = { ...folderBookmarkCounts.value }
      folderBookmarkCounts.value = response.data.reduce(
        (acc: Record<string, number>, item: any) => {
          acc[item.folder_id || 'uncategorized'] = item.count
          return acc
        },
        {},
      )

      console.log('Old counts:', oldCounts)
      console.log('New counts:', folderBookmarkCounts.value)
    } catch (error) {
      console.error('Failed to fetch bookmark counts:', error)
    }
  }

  // Fetch bookmarks with optional folder filter
  const fetchBookmarks = async (params: BookmarkParams = {}) => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/bookmarks', {
        params: {
          folder_id: params.folder_id || null,
          include_subfolders: params.include_subfolders ?? includeSubfolders.value,
        },
      })

      bookmarks.value = response.data || []
      organizeBookmarksByFolder(bookmarks.value)
    } catch (e) {
      error.value = 'Failed to fetch bookmarks'
      bookmarks.value = []
      bookmarksByFolder.value = new Map()
    } finally {
      loading.value = false
    }
  }

  // Get bookmarks for a specific folder
  const getBookmarkCount = (folderId: string) => {
    return folderBookmarkCounts.value[folderId] || 0
  }

  const moveBookmarks = async (bookmarkIds: string[], targetFolderId: string) => {
    loading.value = true
    try {
      const response = await $fetch('/api/bookmarks/move', {
        method: 'PATCH',
        body: {
          bookmarkIds,
          targetFolderId,
        },
      })

      // Optimistically update the local state
      bookmarks.value = bookmarks.value.map((bookmark) =>
        bookmarkIds.includes(bookmark.id) ? { ...bookmark, folder_id: targetFolderId } : bookmark,
      )

      // Fetch fresh data to ensure consistency
      await fetchBookmarks()
      return response.data
    } catch (error) {
      console.error('Error moving bookmarks:', error)
      await fetchBookmarks()
      throw error
    } finally {
      loading.value = false
    }
  }

  const toggleBookmark = async (content: BookmarkContent) => {
    // Check if bookmark exists first
    const existingBookmark = bookmarks.value.find(
      (b) => b.content_id === content.id && b.content_type === content.type,
    )

    try {
      if (existingBookmark) {
        // Optimistically remove from local state
        bookmarks.value = bookmarks.value.filter((b) => b.id !== existingBookmark.id)
      }

      const response = await $fetch('/api/bookmarks/toggle', {
        method: 'POST',
        body: {
          content_id: content.id,
          content_type: content.type,
          folder_id: content.folder_id,
          metadata: {
            title: content.title,
            description: content.description,
            thumbnail: content.thumbnail,
            url: content.url,
            author: content.author,
          },
        },
      })

      // Update local state with server response if it's an add operation
      if (!existingBookmark && response.data) {
        bookmarks.value = [...bookmarks.value, response.data]
      }

      // Fetch counts since they might have changed
      await fetchBookmarkCounts()
      return response.data
    } catch (error) {
      console.error('Error toggling bookmark:', error)
      // Revert local state by refetching on error
      await fetchBookmarks()
      throw error
    }
  }

  // In useBookmarkStore
  const removeBookmarks = (bookmarkIds: string[]) => {
    // Update local state first
    bookmarks.value = bookmarks.value.filter((b) => !bookmarkIds.includes(b.id))
  }

  const isBookmarked = computed(() => (contentId: string, contentType: string = 'news') => {
    return bookmarks.value.some(
      (bookmark) => bookmark.content_id === contentId && bookmark.content_type === contentType,
    )
  })

  const filteredBookmarks = computed(() => {
    let filtered = bookmarks.value

    // Filter by folder
    if (currentFolderId.value) {
      filtered = filtered.filter((bookmark) => {
        if (includeSubfolders.value) {
          // TODO: Add logic for subfolder inclusion when implemented
          return bookmark.folder_id === currentFolderId.value
        }
        return bookmark.folder_id === currentFolderId.value
      })
    }

    // Filter by search
    if (searchQuery.value) {
      const fuse = new Fuse(filtered, {
        keys: [
          'metadata.title',
          'metadata.description',
          'metadata.author',
          'metadata.abstract',
          'metadata.name',
        ],
        threshold: 0.3,
        shouldSort: true,
      })
      return fuse.search(searchQuery.value).map((result) => result.item)
    }

    return filtered
  })

  const setCurrentFolder = async (folderId: string | null) => {
    currentFolderId.value = folderId
    await fetchBookmarks({
      folder_id: folderId,
      include_subfolders: includeSubfolders.value,
    })
  }

  const setIncludeSubfolders = async (include: boolean) => {
    includeSubfolders.value = include
    if (currentFolderId.value) {
      await fetchBookmarks({
        folder_id: currentFolderId.value,
        include_subfolders: include,
      })
    }
  }

  const setSearchQuery = (query: string) => {
    searchQuery.value = query
  }

  // Reset state
  const resetFilters = async () => {
    currentFolderId.value = null
    includeSubfolders.value = true
    searchQuery.value = ''
    await fetchBookmarks()
  }

  return {
    bookmarks,
    loading,
    error,
    bookmarksByFolder,
    currentFolderId,
    includeSubfolders,
    searchQuery,

    // Computed
    filteredBookmarks,

    // Actions
    removeBookmarks,
    fetchBookmarks,
    setCurrentFolder,
    setIncludeSubfolders,
    setSearchQuery,
    resetFilters,
    getBookmarkCount,
    fetchBookmarkCounts,

    moveBookmarks,
    toggleBookmark,
    isBookmarked,
  }
})
