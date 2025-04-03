<script setup lang="ts">
// Update to use the new contents table with content_type filter and include content_sources
const { store, loadMore } = useSelectData<any>('contents', {
  // Updated to query the contents table with news content_type and join content_sources
  orderBy: { column: 'hot_score', ascending: false },
  filters: { content_type: { eq: 'news' }, deleted_at: { is: null } },
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
    details,
    content_sources (
      id,
      name,
      url
    )
  `,
  pagination: { page: 1, limit: 21 },
  initialFetch: true,
  storeKey: 'hotFeed',
})

const { items: newsItems } = storeToRefs(store)
const displayedFeed = ref<Array<any>>([])
const loading = useLoadingStore()

// Ads integration
const { integrateAdsIntoFeed, resetAdTracking, isLoading: adsLoading } = useAdsStore()

// Process items to include source name from joined content_sources table
const processNewsItems = (items: any[]) => {
  return items.map((item) => {
    if (!item.content_sources || item.type === 'sponsored') return item

    // Add source name to the details object
    const updatedItem = {
      ...item,
      details: {
        ...item.details,
        source_name: item.content_sources?.name,
      },
    }

    return updatedItem
  })
}

// Update feed with ads
const updateDisplayedFeed = (items: any[], isFullRefresh = false) => {
  // Process items to include source names
  const processedItems = processNewsItems(items)

  if (isFullRefresh) {
    resetAdTracking()
    displayedFeed.value = integrateAdsIntoFeed(processedItems, true)
  } else {
    const integratedChunk = integrateAdsIntoFeed(processedItems, false)
    displayedFeed.value = [...displayedFeed.value, ...integratedChunk]
  }
}

// Watch for changes in news items
watch(newsItems, (newVal) => {
  if (displayedFeed.value.length === 0) {
    // Initial load
    updateDisplayedFeed(newVal, true)
  } else {
    // Handle infinite scroll updates
    const addedItems = newVal.slice(displayedFeed.value.length)
    updateDisplayedFeed(addedItems, false)
  }
})

const showSkeletonGrid = computed(() => {
  // Use type assertion to handle the DomainKey type issue
  const isLoading = (loading.isLoading('hotFeed' as any) ?? false) as boolean
  return isLoading || adsLoading.value
})
</script>

<template>
  <div class="min-h-[800px]">
    <Transition
      name="fade"
      mode="out-in"
    >
      <IBInfiniteScroll
        v-if="!showSkeletonGrid"
        :threshold="1400"
        @update:scroll-end="loadMore"
      >
        <FeedGrid :items="displayedFeed" />
      </IBInfiniteScroll>

      <FeedSkeleton v-else />
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
