<!-- RecentFeed.vue -->
<script setup lang="ts">
interface SponsoredAd {
  id: string
  type: 'sponsored'
  content: Ad
  sortIndex: number
  adIndex: number
}

const { store, loadMore } = useSelectData<News>('news_details', {
  orderBy: { column: 'created_at', ascending: false },
  pagination: {
    page: 1,
    limit: 21,
  },
  initialFetch: true,
  storeKey: 'recentFeed',
})

const { items: newsItems } = storeToRefs(store)
const displayedFeed = ref<Array<News | SponsoredAd>>([])
const loading = useLoadingStore()

// Ads integration
const { integrateAdsIntoFeed, resetAdTracking, isLoading: adsLoading } = useAdsStore()

// Update feed with ads
const updateDisplayedFeed = (items: News[], isFullRefresh = false) => {
  if (isFullRefresh) {
    resetAdTracking()
    displayedFeed.value = integrateAdsIntoFeed(items, true)
  } else {
    const integratedChunk = integrateAdsIntoFeed(items, false)
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
