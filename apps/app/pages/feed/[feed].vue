<script setup lang="ts">
const route = useRoute()
const feedId = computed(() => String(route.params.feed))
const { deleteFeed, currentFeedName } = usePages()

console.log('feedId', feedId.value)

const isLoadingDependencies = ref(true)
// Load feed categories and sources
const { store: categoriesStore, isSelecting: isLoadingCategories } = useSelectData(
  'feed_categories',
  {
    columns: 'id, feed_id, categories(id, name)',
    filters: { feed_id: { eq: feedId.value } },
    orderBy: { column: 'created_at', ascending: false },
    initialFetch: true,
    storeKey: `feedCategories_${feedId.value}`,
  },
)

const { store: sourcesStore, isSelecting: isLoadingSources } = useSelectData('feed_sources', {
  columns: 'id, feed_id, content_source_id, content_sources(id, url, content_type)',
  filters: { feed_id: { eq: feedId.value } },
  orderBy: { column: 'created_at', ascending: false },
  initialFetch: true,
  storeKey: `feedSources_${feedId.value}`,
})

const { items: proxyCategories } = storeToRefs(categoriesStore)
const { items: proxySources } = storeToRefs(sourcesStore)

const categories = computed(() => proxyCategories.value.map((item) => toRaw(item).categories))
const sources = computed(() => proxySources.value.map((item) => toRaw(item).content_sources))

// Watch for dependencies to load
watchEffect(() => {
  isLoadingDependencies.value = isLoadingCategories.value || isLoadingSources.value
})

// Initialize news only after dependencies are loaded
// Updated to use new content table structure
const newsQuery = computed(() => {
  // Start with base filters for unified content table
  const queryFilters: Record<string, FilterOption> = {}

  // Add content_type filter for news type
  queryFilters['content_type'] = { eq: 'news' }

  // Add source filtering if available
  if (sources.value?.length && sources.value[0]) {
    queryFilters['source_id'] = { in: sources.value.map((source) => source.id) }
  }

  // Add category filtering if available - assumes categories are in details JSONB
  if (categories.value?.length && categories.value[0]) {
    const categoryIds = categories.value.map((category) => category.id)

    // Create a condition for JSONB details field containing category_id
    // Note: This implementation might need to be adjusted based on your exact JSONB structure
    queryFilters['details->category_id'] = { in: categoryIds.join(',') }
  }

  // Content must be active and not deleted
  queryFilters['is_active'] = { eq: true }
  queryFilters['deleted_at'] = { is: null }

  return {
    // Updated to query the contents table with needed fields
    columns: `
      id, 
      content_type,
      title, 
      url, 
      created_at, 
      hot_score,
      published_at, 
      description, 
      author, 
      featured_image, 
      source_id,
      company_id,
      details
    `,
    filters: queryFilters,
    orderBy: { column: 'published_at', ascending: false },
    pagination: { page: 1, limit: 20 },
    storeKey: `customFeed_${feedId.value}`,
    enabled: !isLoadingDependencies.value,
  }
})

const news = computed(() => newsStore?.items || [])

// Create news store only when query is ready
const {
  store: newsStore,
  loadMore: loadMoreFunc,
  refresh: refreshNews,
  isSelecting: isLoadingNews,
} = useSelectData<any>('contents', newsQuery)

// Watch for query changes to refresh
watch(
  newsQuery,
  () => {
    if (newsQuery.value && refreshNews) {
      newsStore.clearItems()
      refreshNews()
    }
  },
  { deep: true },
)

// Safe loadMore function
const handleLoadMore = async () => {
  if (isLoadingNews.value || !loadMoreFunc) return

  try {
    await loadMoreFunc()
  } catch (error: any) {
    console.error('Error loading more news:', error)
  }
}

// Loading states
const loading = useLoadingStore()
const isLoading = computed(
  () =>
    isLoadingDependencies.value ||
    isLoadingNews.value ||
    loading.isLoading(`customFeed_${feedId.value}`),
)

onUnmounted(() => {
  newsStore?.clearItems()
})

// URL formatting helper
const formatSourceUrl = (url: string) => {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    return url
  }
}
const { topBannerAd } = useAdsStore()

// UI state
const showFiltersModal = ref(false)

// Clean up store when component is unmounted
onUnmounted(() => {
  newsStore.clearItems()
})
</script>

<template>
  <div>
    <FeedTitle
      :title="currentFeedName"
      :filters="{ categories, sources }"
    />

    <BlackFridayBanner />

    <!-- <AdsBanner
      v-if="topBannerAd"
      :ad="topBannerAd"
    /> -->

    <IBInfiniteScroll
      :threshold="1400"
      @update:scroll-end="handleLoadMore"
    >
      <div
        class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
      >
        <NewsCard
          v-for="item in news"
          :key="`news-post-${item.id}`"
          :news="item"
        />
        <NewsCardSkeleton v-show="isLoading" />
      </div>
    </IBInfiniteScroll>

    <PrimeDialog
      v-model:visible="showFiltersModal"
      modal
      header="Feed Filters"
      :style="{ width: '50vw' }"
    >
      <div class="space-y-6">
        <div v-if="categories.length">
          <h3 class="text-lg font-semibold mb-3">Categories</h3>
          <div class="flex flex-wrap gap-2">
            <PrimeChip
              v-for="category in categories"
              :key="category.id"
              :label="category.name"
              class="bg-primary-700 border border-primary-600"
            />
          </div>
        </div>

        <div v-if="sources.length">
          <h3 class="text-lg font-semibold mb-3">Sources</h3>
          <div class="flex flex-wrap gap-2">
            <PrimeChip
              v-for="source in sources"
              :key="source.id"
              :label="formatSourceUrl(source.url)"
              :title="source.url"
              class="bg-secondary-700 border border-secondary-600"
            >
              <template #extra>
                <span class="text-xs ml-1 opacity-75">{{ source.content_type }}</span>
              </template>
            </PrimeChip>
          </div>
        </div>
      </div>
    </PrimeDialog>
  </div>
</template>
