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

const { store, loadMore, refresh } = useSelectData<News>('contents', {
  columns:
    'id, title, url, created_at, content_type, hot_score, news(published_at, description, category_id, author, keywords, featured_image, company_id, score, companies(name, logo_url))',
  filters: {
    content_type: { eq: 'news' },
  },
  orderBy: orderBy.value,
  initialFetch: true,
  pagination: { page: 1, limit: 20 },
  storeKey: 'mainFeed',
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
    url: item.url,
    created_at: item.created_at || null,
  }
}

const { items: proxyNews } = storeToRefs(store)
// Add transition state

// Modify how the news items are displayed
const visibleNews = computed(() => {
  return proxyNews.value.map((item) => mapContentToNews(toRaw(item)))
})

const loading = useLoadingStore()
const isTransitioning = ref(false)

const showSkeletonGrid = computed(() => {
  const isLoadingState = loading.isLoading(domainKey)
  const isTransitioningState = isTransitioning.value
  console.log('Loading states:', { isLoadingState, isTransitioningState })
  return isLoadingState || isTransitioningState
})

async function toggleHotScore(newValue: 'created_at' | 'hot_score') {
  // Remove this line since we're now getting the new value directly
  // sortingMethod.value = sortingMethod.value === 'created_at' ? 'hot_score' : 'created_at'

  isTransitioning.value = true
  loading.setLoading(domainKey, true)

  const scrollPosition = window.scrollY

  try {
    // Use the new value directly
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

definePageMeta({
  name: 'News',
})
</script>

<template>
  <div>
    <FeedTitle title="News Feed" />
    <BlackFridayBanner />

    <FeedHotToggle
      v-model="sortingMethod"
      @update:model-value="toggleHotScore"
    />

    <div class="min-h-[800px]">
      <Transition
        name="fade"
        mode="out-in"
      >
        <!-- Real Content -->
        <IBInfiniteScroll
          v-if="!showSkeletonGrid"
          @update:scroll-end="loadMore()"
        >
          <div
            class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
          >
            <NewsCard
              v-for="item in visibleNews"
              :key="item.id"
              :news="item"
            />
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
</style>
