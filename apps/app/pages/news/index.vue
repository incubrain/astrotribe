<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useNewsStore } from '@/stores/useNewsStore'

const FEATURE = 'DISCOVERY'

// Initialize stores
const newsStore = useNewsStore()
const { topBannerAd } = useAdsStore()

const { loading, error, filteredNews, filters } = storeToRefs(newsStore)

// Get feature limit info using the same composable as companies page
const { limitedItems, lastRowItems, showPaywall, totalCount, remainingItems } = useFeatureLimit({
  feature: FEATURE,
  contentType: 'news',
  items: computed(() => filteredNews.value),
})

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

// Computed properties for content display
const isLoading = computed(() => newsStore.loading)
const hasNews = computed(() => limitedItems.value.length > 0)
console.log('NEWS DATA:', limitedItems.value, lastRowItems.value, hasNews.value, isLoading.value)
</script>

<template>
  <div>
    <!-- Page Header -->
    <FeedTitle title="News Feed" />

    <div class="p-8">
      <!-- Top Ad Banner -->
      <!-- <AdsBanner v-if="topBannerAd" :ad="topBannerAd" /> -->

      <div
        class="bg-primary-900/40 backdrop-blur-sm border border-primary-800/30 rounded-xl p-4 lg:p-8 mb-6"
      >
        <div class="flex gap-2 items-center mb-2">
          <Icon
            name="mdi:trending-up"
            class="w-5 h-5 text-primary-500"
          />
          <h3 class="text-lg font-semibold">Trending Topics</h3>
        </div>

        <IBHorizontalScroll>
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
        </IBHorizontalScroll>
      </div>

      <!-- Category Filters -->
      <NewsFilterBar class="p-4" />

      <!-- View Toggle and Sort Controls -->
      <div class="flex items-center justify-between mb-6">
        <div class="text-sm text-gray-400">
          {{ filteredNews.length }} articles found
          <span v-if="showPaywall"> (showing {{ limitedItems.length }}) </span>
        </div>

        <ViewToggle />
      </div>

      <!-- News Content -->
      <Transition
        name="fade"
        mode="out-in"
      >
        <div v-if="hasNews">
          <ViewWrapper
            :show-paywall="showPaywall"
            :items-shown="limitedItems.length"
            :feature="FEATURE"
            :total="totalCount"
          >
            <template #items>
              <NewsCard
                v-for="item in limitedItems"
                :key="item.id"
                :news="item"
                :layout="newsStore.viewMode"
              />
            </template>

            <template #last-row-items>
              <NewsCard
                v-for="item in lastRowItems"
                :key="`last-row-${item.id}`"
                :news="item"
                :layout="newsStore.viewMode"
              />
            </template>
          </ViewWrapper>

          <div
            v-if="isLoading && !showPaywall"
            class="flex justify-center py-8"
          >
            <Icon
              name="mdi:loading"
              class="w-8 h-8 text-primary-500 animate-spin"
            />
          </div>
        </div>

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

      <FeatureCTA
        v-if="showPaywall"
        :feature="FEATURE"
        :remaining="remainingItems"
        :show="showPaywall"
      />
    </div>
  </div>
</template>
