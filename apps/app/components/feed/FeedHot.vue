<!-- HotFeed.vue -->
<script setup lang="ts">
const { store, loadMore } = useSelectData<News>('news_details', {
  orderBy: { column: 'hot_score', ascending: false },
  pagination: {
    page: 1,
    limit: 21,
  },
  initialFetch: true,
  storeKey: 'hotFeed',
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

const showSkeletonGrid = computed(() => loading.isLoading('hotFeed') || adsLoading.value)
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
