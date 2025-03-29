<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNewsStore } from '@/stores/useNewsStore'

definePageMeta({ name: 'News Feed' })

// Initialize stores
const newsStore = useNewsStore()
const { topBannerAd } = useAdsStore()

// Trending topics (for demo/placeholder)
const trendingTopics = ref([
  'Black Holes',
  'NASA',
  'SpaceX',
  'Space Exploration',
  'Exoplanets',
  'ISS',
  'Mars Mission',
  'Astronomy',
  'Astrophysics',
  'Rocket Launch',
])

// Initialize news store when component is mounted
onMounted(async () => {
  if (!newsStore.news.length) {
    await newsStore.init()
  }
})

// Computed properties for content display
const isLoading = computed(() => newsStore.loading)
const hasNews = computed(() => newsStore.news.length > 0)
const displayNews = computed(() => newsStore.filteredNews)

// Handle infinite scroll loading
const handleLoadMore = async () => {
  if (!isLoading.value && newsStore.hasMore) {
    await newsStore.loadMore()
  }
}

// Layout classes based on view mode
const layoutClasses = computed(() => {
  return newsStore.viewMode === 'grid'
    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
    : 'flex flex-col gap-4'
})
</script>

<template>
  <div class="pb-8">
    <!-- Page Header -->
    <FeedTitle title="News Feed" />

    <!-- Top Ad Banner -->
    <!-- <AdsBanner v-if="topBannerAd" :ad="topBannerAd" /> -->

    <!-- Category Filters -->
    <NewsFilterBar class="p-4" />

    <!-- Trending Topics -->
    <div
      class="bg-primary-900/40 backdrop-blur-sm border border-primary-800/30 rounded-xl p-4 mb-6"
    >
      <div class="flex gap-2 items-center mb-2">
        <Icon
          name="mdi:trending-up"
          class="w-5 h-5 text-primary-500"
        />
        <h3 class="text-lg font-semibold">Trending Topics</h3>
      </div>

      <UiHorizontalScroll>
        <div class="flex gap-3 py-1">
          <button
            v-for="topic in trendingTopics"
            :key="topic"
            class="bg-primary-950/70 hover:bg-primary-800/50 transition-colors py-2 px-4 rounded-lg text-sm whitespace-nowrap"
            @click="newsStore.setSearchQuery(topic)"
          >
            {{ topic }}
          </button>
        </div>
      </UiHorizontalScroll>
    </div>

    <!-- Advanced Filters -->
    <NewsAdvancedFilters />

    <!-- View Toggle and Sort Controls -->
    <div class="flex items-center justify-between mb-6">
      <div class="text-sm text-gray-400"> {{ displayNews.length }} articles found </div>

      <NewsViewToggle />
    </div>

    <!-- News Content -->
    <IBInfiniteScroll
      :threshold="1400"
      @update:scroll-end="handleLoadMore"
    >
      <!-- Loading state -->
      <Transition
        name="fade"
        mode="out-in"
      >
        <div
          v-if="isLoading && !hasNews"
          :class="layoutClasses"
        >
          <NewsCardSkeleton
            :layout="newsStore.viewMode"
            :count="newsStore.viewMode === 'grid' ? 9 : 5"
          />
        </div>

        <!-- Content display -->
        <div
          v-else-if="hasNews"
          :class="layoutClasses"
        >
          <NewsCard
            v-for="item in displayNews"
            :key="item.id"
            :news="item"
            :layout="newsStore.viewMode"
          />
        </div>

        <!-- Empty state -->
        <div
          v-else
          class="py-12 text-center"
        >
          <div
            class="bg-primary-900/30 rounded-lg border border-primary-800/20 p-8 max-w-md mx-auto"
          >
            <Icon
              name="mdi:newspaper-variant-outline"
              class="w-16 h-16 text-primary-600/50 mx-auto mb-4"
            />
            <h3 class="text-xl font-semibold mb-2">No News Found</h3>
            <p class="text-gray-400 mb-4">
              We couldn't find any news articles that match your search criteria.
            </p>
            <PrimeButton
              v-if="Object.values(newsStore.filters).some((f) => f)"
              @click="newsStore.clearFilters"
            >
              Clear Filters
            </PrimeButton>
          </div>
        </div>
      </Transition>

      <!-- Loading indicator for infinite scroll -->
      <div
        v-if="isLoading && hasNews"
        class="flex justify-center py-8"
      >
        <Icon
          name="mdi:loading"
          class="w-8 h-8 text-primary-500 animate-spin"
        />
      </div>
    </IBInfiniteScroll>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
