import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export type NewsCategory = 'all' | 'discoveries' | 'events' | 'research' | 'new' | 'hot'
export type NewsViewMode = 'grid' | 'list'

export type NewsSource = {
  id: string
  name: string
}

export type NewsDateRange = {
  start: string | null
  end: string | null
}

const filters = ref<NewsFilters>({
  category: 'all',
  sources: [],
  dateRange: { start: null, end: null },
  tags: [],
  searchQuery: '',
})

export const useNewsStore = defineStore('news', () => {
  // State
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const news = ref<any[]>([])
  const trending = ref<string[]>([])
  const hasMore = ref(true)
  const page = ref(1)
  const pageSize = ref(20)

  // Filters
  const filters = ref<NewsFilters>({
    category: 'all',
    sources: [],
    dateRange: { start: null, end: null },
    tags: [],
    searchQuery: '',
  })

  // View preferences
  const viewMode = ref<NewsViewMode>('grid')
  const isAdvancedFiltersVisible = ref(false)

  // Sources and tags for filtering
  const availableSources = ref<NewsSource[]>([])
  const availableTags = ref<string[]>([])

  // Computed
  const filteredNews = computed(() => {
    let filtered = news.value

    // Apply category filter
    if (filters.value.category !== 'all') {
      if (filters.value.category === 'new') {
        // Sort by date, newest first
        filtered = [...filtered].sort(
          (a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime(),
        )
      } else if (filters.value.category === 'hot') {
        // Sort by hot score, highest first
        filtered = [...filtered].sort((a, b) => b.hot_score - a.hot_score)
      } else {
        // Filter by category
        filtered = filtered.filter((item) =>
          item.details?.categories?.some(
            (cat: any) => cat.name?.toLowerCase() === filters.value.category,
          ),
        )
      }
    }

    // Apply source filter
    if (filters.value.sources.length > 0) {
      filtered = filtered.filter((item) => filters.value.sources.includes(item.source_id))
    }

    // Apply date range filter
    if (filters.value.dateRange.start || filters.value.dateRange.end) {
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.published_at)
        const startDate = filters.value.dateRange.start
          ? new Date(filters.value.dateRange.start)
          : null
        const endDate = filters.value.dateRange.end ? new Date(filters.value.dateRange.end) : null

        const startOk = !startDate || itemDate >= startDate
        const endOk = !endDate || itemDate <= endDate
        return startOk && endOk
      })
    }

    // Apply tags filter
    if (filters.value.tags.length > 0) {
      filtered = filtered.filter((item) =>
        item.details?.tags?.some((tag: string) => filters.value.tags.includes(tag)),
      )
    }

    // Apply search filter
    if (filters.value.searchQuery) {
      const query = filters.value.searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  // Actions
  const fetchNews = async (reset = false) => {
    if (loading.value) return

    loading.value = true
    error.value = null

    try {
      if (reset) {
        page.value = 1
        news.value = []
        hasMore.value = true
      }

      const response = await $fetch('/api/news', {
        params: {
          page: page.value,
          pageSize: pageSize.value,
          category: filters.value.category !== 'all' ? filters.value.category : undefined,
          sources: filters.value.sources.length ? filters.value.sources.join(',') : undefined,
          tags: filters.value.tags.length ? filters.value.tags.join(',') : undefined,
          startDate: filters.value.dateRange.start || undefined,
          endDate: filters.value.dateRange.end || undefined,
          search: filters.value.searchQuery || undefined,
        },
      })

      console.log('FETCHING NEWS RESPONSE', response)

      const newItems = response.data || []

      if (reset) {
        news.value = newItems
      } else {
        news.value = [...news.value, ...newItems]
      }

      hasMore.value = newItems.length === pageSize.value
      page.value++
    } catch (err: any) {
      console.error('Error fetching news:', err)
      error.value = err
    } finally {
      loading.value = false
    }
  }

  const fetchSources = async () => {
    try {
      const response = await $fetch('/api/news/sources')
      availableSources.value = response.data || []
    } catch (err) {
      console.error('Error fetching news sources:', err)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await $fetch('/api/news/tags')
      availableTags.value = response.data || []
    } catch (err) {
      console.error('Error fetching news tags:', err)
    }
  }

  const fetchTrending = async () => {
    try {
      const response = await $fetch('/api/news/trending')
      trending.value = response.data || []
    } catch (err) {
      console.error('Error fetching trending topics:', err)
    }
  }

  const loadMore = async () => {
    if (hasMore.value && !loading.value) {
      await fetchNews()
    }
  }

  const setCategory = (category: NewsCategory) => {
    filters.value.category = category
    fetchNews(true)
  }

  const toggleSource = (sourceId: string) => {
    const index = filters.value.sources.indexOf(sourceId)
    if (index > -1) {
      filters.value.sources.splice(index, 1)
    } else {
      filters.value.sources.push(sourceId)
    }
    fetchNews(true)
  }

  const toggleTag = (tag: string) => {
    const index = filters.value.tags.indexOf(tag)
    if (index > -1) {
      filters.value.tags.splice(index, 1)
    } else {
      filters.value.tags.push(tag)
    }
    fetchNews(true)
  }

  const setDateRange = (range: { start: Date | null; end: Date | null }) => {
    filters.value.dateRange = {
      start: range.start ? range.start.toISOString() : null,
      end: range.end ? range.end.toISOString() : null,
    }
    fetchNews(true)
  }

  const setSearchQuery = (query: string) => {
    filters.value.searchQuery = query
    fetchNews(true)
  }

  const toggleViewMode = () => {
    viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  }

  const toggleAdvancedFilters = () => {
    isAdvancedFiltersVisible.value = !isAdvancedFiltersVisible.value
  }

  const clearFilters = () => {
    filters.value = {
      category: 'all',
      sources: [],
      dateRange: { start: null, end: null },
      tags: [],
      searchQuery: '',
    }
    fetchNews(true)
  }

  // Initialize store
  const init = async () => {
    await Promise.all([fetchNews(true), fetchSources(), fetchTags(), fetchTrending()])
  }

  onMounted(async () => {
    if (!news.value.length) {
      await init()
    }
  })

  return {
    // State
    loading,
    error,
    news,
    trending,
    hasMore,
    filters,
    availableSources,
    availableTags,
    viewMode,
    isAdvancedFiltersVisible,

    // Computed
    filteredNews,

    // Actions
    fetchNews,
    loadMore,
    setCategory,
    toggleSource,
    toggleTag,
    setDateRange,
    setSearchQuery,
    toggleViewMode,
    toggleAdvancedFilters,
    clearFilters,
    init,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useNewsStore, import.meta.hot))
}
