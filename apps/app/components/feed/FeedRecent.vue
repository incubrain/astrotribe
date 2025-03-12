<script setup lang="ts">
interface SponsoredAd {
  id: string
  type: 'sponsored'
  content: Ad
  sortIndex: number
  adIndex: number
}

// Update to use the new contents table and include content_sources data
const { store, loadMore } = useSelectData<any>('contents', {
  // Updated query for the unified contents table with joined content_sources
  orderBy: { column: 'published_at', ascending: false },
  filters: { content_type: { eq: 'news' }, is_active: { eq: true }, deleted_at: { is: null } },
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
  storeKey: 'recentFeed',
})

const { items: newsItems } = storeToRefs(store)
const displayedFeed = ref<Array<any | SponsoredAd>>([])
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

// Handle loading states
const showSkeletonGrid = computed(() => loading.isLoading('recentFeed') || adsLoading.value)

// Debug logs
onMounted(() => {
  console.log('RecentFeed mounted')
})

watch(displayedFeed, (newVal) => {
  console.log('DisplayedFeed updated:', {
    length: newVal.length,
    firstThreeIds: newVal.slice(0, 3).map((item) => item.id),
  })
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
