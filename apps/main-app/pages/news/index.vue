<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const domainKey = 'mainFeed'

const sortingMethod = ref<'created_at' | 'hot_score'>('created_at')

const orderBy = computed(() => ({
  column: sortingMethod.value,
  ascending: false,
}))

// const supabase = useSupabaseClient()
// const { data, error } = await supabase.rpc('get_contents')

const {
  store,
  loadMore: originalLoadMore,
  refresh,
} = useSelectData<News>('news', {
  columns: `id, title, published_at, description, category_id, author, keywords, featured_image, company_id, score, companies!inner(name, logo_url),
      news_summaries!inner(id, summary, complexity_level, version)
    )`,
  filters: {
    // id: { in: data.map((item) => item.id) },
    featured_image: { neq: null },
  },
  orderBy: orderBy.value,
  initialFetch: true,
  storeKey: 'mainFeed',
  pagination: { page: 1, limit: 20 },
})

function mapContentToNews(item: any): News {
  return {
    id: item.id,
    title: item.title,
    content_type: item.content_type,
    published_at: item.news?.published_at || null,
    featured_image: item.news?.featured_image || '',
    description: item.news?.description || '',
    author: item.news?.author || '',
    keywords: item.news?.keywords || {},
    hot_score: item.hot_score || 0,
    category_id: item.news?.category_id || null,
    company_id: item.news?.company_id || null,
    companies: item.news?.companies || [],
    summary: item.news?.news_summaries || {},
    url: item.url,
    created_at: item.created_at || null,
  }
}

const { items: proxyNews } = storeToRefs(store)
// Add transition state

const {
  topBannerAd, // This is now already a computed value from the store
  integrateAdsIntoFeed,
  resetAdTracking,
  isLoading: adsLoading,
} = useAdsStore()

const loading = useLoadingStore()
const isTransitioning = ref(false)

// A ref to store the fully integrated feed (news + ads)
const displayedFeed = ref<
  Array<
    | News
    | {
        id: string
        type: 'sponsored'
        content: Ad
        sortIndex: number
        adIndex: number
      }
  >
>([])

const visibleNews = computed(() => displayedFeed.value)

const updateDisplayedFeed = (newsItems: News[], isFullRefresh = false) => {
  const mappedNews = newsItems.map((item) => mapContentToNews(toRaw(item)))

  if (isFullRefresh) {
    resetAdTracking()
    displayedFeed.value = integrateAdsIntoFeed(mappedNews, true)
  } else {
    const integratedChunk = integrateAdsIntoFeed(mappedNews, false)
    displayedFeed.value = [...displayedFeed.value, ...integratedChunk]
  }
}

// Initialize displayedFeed after initial fetch
watch(proxyNews, (newVal) => {
  if (isTransitioning.value) {
    // Sorting refresh scenario
    updateDisplayedFeed(newVal, true)
  } else if (displayedFeed.value.length === 0) {
    // Initial load scenario
    updateDisplayedFeed(newVal, true)
  } else {
    // If this triggers after infinite scroll additions,
    // new items are appended to proxyNews so we only integrate the added portion:
    if (newVal.length > displayedFeed.value.length) {
      const addedItems = newVal.slice(displayedFeed.value.length)
      updateDisplayedFeed(addedItems, false)
    }
  }
})

const showSkeletonGrid = computed(() => {
  const isLoadingState = loading.isLoading(domainKey)
  const isTransitioningState = isTransitioning.value
  const isAdsLoading = adsLoading.value
  return isLoadingState || isTransitioningState || isAdsLoading
})

async function toggleHotScore(newValue: 'created_at' | 'hot_score') {
  isTransitioning.value = true
  loading.setLoading(domainKey, true)

  const scrollPosition = window.scrollY

  try {
    // Sorting changed - full refresh scenario
    sortingMethod.value = newValue
    await refresh()
    await nextTick()
    window.scrollTo(0, scrollPosition)
  } catch (error) {
    console.error('Error toggling hot score:', error)
  } finally {
    loading.setLoading(domainKey, false)
    setTimeout(() => {
      isTransitioning.value = false
    }, 150)
  }
}

// Wrap loadMore to append new items incrementally
async function handleLoadMore() {
  // await originalLoadMore()
}

definePageMeta({
  name: 'News',
})
</script>

<template>
  <div>
    <FeedTitle title="News Feed" />

    <BlackFridayBanner />

    <AdsBanner
      v-if="topBannerAd"
      :ad="topBannerAd"
    />
    <FeedHotToggle
      v-model="sortingMethod"
      @update:model-value="toggleHotScore"
    />

    <div class="min-h-[800px]">
      <Transition
        name="fade"
        mode="out-in"
      >
        <IBInfiniteScroll
          v-if="!showSkeletonGrid"
          :threshold="1400"
          @update:scroll-end="handleLoadMore"
        >
          <div
            class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
          >
            <template
              v-for="(item, index) in visibleNews"
              :key="item.id"
            >
              <div
                :id="`feed-item-${index}`"
                class="grid-item"
              >
                <NewsCard
                  v-if="item.type !== 'sponsored'"
                  :news="item"
                />
                <AdsFeedCard
                  v-else
                  :ad="item.content"
                />
              </div>
            </template>
          </div>
        </IBInfiniteScroll>

        <!-- Skeleton Grid -->
        <div
          v-else
          class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
        >
          <NewsCardSkeleton
            v-for="n in 6"
            :key="`skeleton-${n}`"
          />
        </div>
      </Transition>
    </div>
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

.grid-item {
  break-inside: avoid;
  page-break-inside: avoid;
}
</style>
