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
  folder?: { id: string; name: string; color: string; is_favorite: boolean }
}

// stores/useBookmarkStore.ts
export const useBookmarkStore = defineStore('bookmarks', () => {
  const bookmarks = ref<Bookmark[]>([])
  const bookmarksByFolder = ref<Map<string, Bookmark[]>>(new Map())
  const showBookmarkFeedback = ref(false)

  const folderBookmarkCounts = ref<Record<string, number>>({})

  const loading = ref(false)
  const error = ref<string | null>(null)
  const currentFolderId = ref<string | null>(null)
  const includeSubfolders = ref(true)
  const searchQuery = ref('')

  const { execute: executeOptimistic } = useOptimisticUpdate()

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
    } catch (error: any) {
      console.error('Failed to fetch bookmark counts:', error)
    }
  }

  // Fetch bookmarks with optional folder filter
  const fetchBookmarks = async (params: BookmarkParams = {}) => {
    loading.value = true
    error.value = null
    try {
      // Add error handling and diagnostics
      const response = await $fetch('/api/bookmarks', {
        params: {
          folder_id: params.folder_id || null,
          include_subfolders: params.include_subfolders ?? includeSubfolders.value,
        },
        // Add error handling
        onResponseError(error) {
          console.error('Bookmark API response error:', error.response?._data || error)
        },
      })

      bookmarks.value = response.data || []
      organizeBookmarksByFolder(bookmarks.value)
    } catch (e) {
      // Improved error logging
      console.error('Failed to fetch bookmarks:', e)
      error.value = e.message || 'Failed to fetch bookmarks'
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

  const toggleBookmark = async (content: BookmarkContent) => {
    // For this function, we need to adapt to the new schema
    // content.type is used in the original function, but the API endpoint
    // now expects content_type based on the content_types table

    const existingBookmark = bookmarks.value.find(
      (b) => b.content_id === content.id && b.content_type === content.type,
    )

    return executeOptimistic({
      key: `bookmark-${content.id}`,
      apiCall: () =>
        $fetch('/api/bookmarks/toggle', {
          method: 'POST',
          body: {
            content_id: content.id,
            content_type: content.type, // Matches the content_type in content_types table
            folder_id: content.folder_id,
            metadata: {
              title: content.title,
              description: content.description,
              thumbnail: content.thumbnail,
              url: content.url,
              author: content.author,
            },
          },
        }),
      optimisticUpdate: () => {
        if (existingBookmark) {
          bookmarks.value = bookmarks.value.filter((b) => b.id !== existingBookmark.id)
        } else {
          // Add optimistic bookmark with temporary id
          const optimisticBookmark = {
            id: `temp-${content.id}`,
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
            created_at: new Date().toISOString(),
          }
          bookmarks.value = [...bookmarks.value, optimisticBookmark]
        }
        organizeBookmarksByFolder(bookmarks.value)
      },
      rollback: () => {
        // Revert to previous state
        if (existingBookmark) {
          bookmarks.value = [...bookmarks.value, existingBookmark]
        } else {
          bookmarks.value = bookmarks.value.filter((b) => b.id !== `temp-${content.id}`)
        }
        organizeBookmarksByFolder(bookmarks.value)
      },
    })
  }

  const moveBookmarks = async (bookmarkIds: string[], targetFolderId: string) => {
    return executeOptimistic({
      key: `move-${bookmarkIds.join('-')}`,
      apiCall: () =>
        $fetch('/api/bookmarks/move', { method: 'PATCH', body: { bookmarkIds, targetFolderId } }),
      optimisticUpdate: () => {
        const previousState = [...bookmarks.value]
        bookmarks.value = bookmarks.value.map((bookmark) =>
          bookmarkIds.includes(bookmark.id) ? { ...bookmark, folder_id: targetFolderId } : bookmark,
        )
        organizeBookmarksByFolder(bookmarks.value)
        return { previousState }
      },
      rollback: (context) => {
        if (context?.previousState) {
          bookmarks.value = context.previousState
          organizeBookmarksByFolder(bookmarks.value)
        }
      },
    })
  }

  const removeBookmarks = async (bookmarkIds: string[]) => {
    return executeOptimistic({
      key: `remove-${bookmarkIds.join('-')}`,
      apiCall: () => $fetch('/api/bookmarks/batch', { method: 'DELETE', body: { bookmarkIds } }),
      optimisticUpdate: () => {
        const previousState = [...bookmarks.value]
        bookmarks.value = bookmarks.value.filter((b) => !bookmarkIds.includes(b.id))
        organizeBookmarksByFolder(bookmarks.value)
        return { previousState }
      },
      rollback: (context) => {
        if (context?.previousState) {
          bookmarks.value = context.previousState
          organizeBookmarksByFolder(bookmarks.value)
        }
      },
    })
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
    await fetchBookmarks({ folder_id: folderId, include_subfolders: includeSubfolders.value })
  }

  const setIncludeSubfolders = async (include: boolean) => {
    includeSubfolders.value = include
    if (currentFolderId.value) {
      await fetchBookmarks({ folder_id: currentFolderId.value, include_subfolders: include })
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

  const handleToggleBookmark = async (content: any) => {
    const folderStore = useFolderStore()
    const defaultFolderId = folderStore.getDefaultFolder?.id
    try {
      // More robust error handling and content validation
      if (!content || !content.id) {
        console.error('Cannot bookmark: Invalid content object', content)
        return
      }

      // Need to handle the new content structure with safer property access
      const bookmarkData = {
        id: content.id,
        type: content.content_type || 'news',
        title: content.title || content.metadata?.title || 'Untitled',
        thumbnail: content.featured_image || content.metadata?.featured_image || null,
        url: content.url || content.metadata?.url || null,
        author: content.author || content.metadata?.author || null,
        description: content.description || content.metadata?.description || null,
        folder_id: defaultFolderId,
      }

      console.log('Bookmarking content:', bookmarkData)
      await toggleBookmark(bookmarkData)
      showBookmarkFeedback.value = true
      setTimeout(() => {
        showBookmarkFeedback.value = false
      }, 1000)
    } catch (error: any) {
      console.error('Error handling bookmark:', error)
    }
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
    showBookmarkFeedback,

    // Actions
    handleToggleBookmark,
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
