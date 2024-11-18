// useBookmarks.ts
import Fuse from 'fuse.js'

interface BookmarkContent {
  id: string
  type: string
  title: string
  description?: string
  thumbnail?: string
  url?: string
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

export const useBookmarks = () => {
  const bookmarks = ref<Bookmark[]>([])
  const bookmarkCache = new Map<string, boolean>()
  const error = ref<string | null>(null)

  const loading = ref(false)
  const { getDefaultFolder } = useFolderSystem()

  const updateCache = (
    item: { content_type: string; content_id: string } | null,
    isBookmarked: boolean,
  ) => {
    if (!item) return

    const cacheKey = `${item.content_type}:${item.content_id}`
    bookmarkCache.set(cacheKey, isBookmarked)
  }

  const updateBatchCache = (
    items: Array<{ content_type: string; content_id: string }>,
    isBookmarked: boolean,
  ) => {
    items.forEach((item) => updateCache(item, isBookmarked))
  }

  const init = async () => {
    const session = await useSupabaseSession()
    if (session.value) {
      await fetchBookmarks({})
    }
  }

  const isNewsBookmarked = computed(() => {
    return (newsId: string) => {
      // Check if this news ID exists in our bookmarks
      return bookmarks.value.some(
        (bookmark) => bookmark.content_id === newsId && bookmark.content_type === 'news',
      )
    }
  })

  const fetchBookmarks = async (params: BookmarkParams) => {
    loading.value = true
    error.value = null

    try {
      // Get last month of bookmarks by default if no specific params

      const defaultParams = {
        content_type: 'news',
        created_at: 'gte.' + new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        ...params,
      }

      const response = await $fetch('/api/bookmarks', {
        params: {
          params: defaultParams,
          include_subfolders: true,
        },
      })

      bookmarks.value = response.data || []

      // Update cache with current bookmarks
      updateBatchCache(
        bookmarks.value.map((bookmark) => ({
          content_type: bookmark.content_type,
          content_id: bookmark.content_id,
        })),
        true,
      )
    } catch (e) {
      error.value = 'Failed to fetch bookmarks'
      bookmarks.value = []
    } finally {
      loading.value = false
    }
  }

  const optimisticUpdate = async (
    content: BookmarkContent,
    userId: string,
    defaultFolderId: string,
  ) => {
    const { id, type, title } = content

    const isBookmarked = bookmarks.value.some(
      (bookmark) =>
        bookmark.user_id === userId && bookmark.content_id === id && bookmark.content_type === type,
    )

    if (isBookmarked) {
      bookmarks.value = bookmarks.value.filter(
        (bookmark) =>
          !(
            bookmark.user_id === userId &&
            bookmark.content_id === id &&
            bookmark.content_type === type
          ),
      )
    } else {
      const bookmark: Bookmark = {
        id: crypto.randomUUID(),
        user_id: userId,
        created_at: Date.now().toString(),
        folder_id: defaultFolderId,
        content_id: id,
        content_type: type,
        metadata: {
          title,
        },
      }

      bookmarks.value.unshift(bookmark)
    }
  }

  // Update toggleBookmark to use the new cache function
  const toggleBookmark = async (content: BookmarkContent) => {
    const { getDefaultFolder } = useFolderSystem()
    const defaultFolderId = getDefaultFolder.value?.id
    const { $id: userId } = useCurrentUser()

    await optimisticUpdate(content, userId, defaultFolderId)
    try {
      const response = await $fetch('/api/bookmarks/toggle', {
        method: 'POST',
        body: {
          content_id: content.id,
          content_type: content.type,
          folder_id: defaultFolderId,
          metadata: {
            title: content.title,
            description: content.description,
            thumbnail: content.thumbnail,
            url: content.url,
          },
        },
      })

      const isBookmarked = response.bookmarked ?? false
      updateCache(
        {
          content_type: content.type,
          content_id: content.id,
        },
        isBookmarked,
      )

      const index = bookmarks.value.findIndex(
        (value) =>
          value.user_id === userId &&
          value.content_id === content.id &&
          value.content_type === content.type,
      )

      if (index > -1) bookmarks.value[index] = response.data

      return response.data
    } catch (error) {
      // Rollback

      await optimisticUpdate(content, userId, defaultFolderId)
    }
  }

  // Update isBookmarked to use the new cache function
  const isBookmarked = async (contentId: string, contentType: string = 'news') => {
    const cacheKey = `${contentType}:${contentId}`

    if (bookmarkCache.has(cacheKey)) {
      return bookmarkCache.get(cacheKey)
    }

    const response = await $fetch('/api/bookmarks/check', {
      params: { content_id: contentId, content_type: contentType },
    })

    updateCache(
      {
        content_type: contentType,
        content_id: contentId,
      },
      !!response.data,
    )

    return !!response.data
  }

  const createBookmark = async (content: BookmarkContent, folderId?: string) => {
    const folder_id = folderId || getDefaultFolder.value?.id

    const response = await $fetch('/api/bookmarks/create', {
      method: 'POST',
      body: {
        content_id: content.id,
        content_type: content.type,
        folder_id,
        metaresponse: {
          title: content.title,
          description: content.description,
          thumbnail: content.thumbnail,
        },
      },
    })
    return response.data
  }

  const moveBookmarks = async (bookmarkIds: string[], targetFolderId: string) => {
    const response = await $fetch('/api/bookmarks/move', {
      method: 'PATCH',
      body: {
        bookmarkIds,
        targetFolderId,
      },
    })

    await fetchBookmarks({})

    return response.data
  }

  const searchBookmarks = (query: string) => {
    const fuse = new Fuse(bookmarks.value, {
      keys: ['metadata.title', 'metadata.description'],
      threshold: 0.3,
    })

    return fuse.search(query)
  }

  const clearCache = () => bookmarkCache.clear()

  onMounted(() => {
    init()
  })

  return {
    bookmarks,
    loading,
    init,
    fetchBookmarks,

    searchBookmarks,
    toggleBookmark,
    createBookmark,
    moveBookmarks,
    isNewsBookmarked,
    isBookmarked,
  }
}
