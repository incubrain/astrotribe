<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue
const { init: initBookmarks } = useBookmarks()

const domainKey = 'news'
const { store, loadMore, refresh } = useSelectData<News>('news', {
  columns:
    'id, title, body, published_at, created_at, description, category_id, author, url, keywords, featured_image, company_id, companies(*), score',
  filters: {
    // content_status: { eq: 'draft' },
    body: { neq: 'null' },
  },
  orderBy: { column: 'created_at', ascending: false },
  initialFetch: true,
  pagination: { page: 1, limit: 20 },
})

const { items: proxyNews } = storeToRefs(store)

const news = computed(() => proxyNews.value.map((item) => toRaw(item)))

console.log('news', news)

const fetchTodaysPosts = async () => {
  // Get the start and end of today in the user's timezone
  const now = new Date()
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const endOfDay = new Date(startOfDay)
  endOfDay.setDate(startOfDay.getDate() + 1)

  // Convert to ISO strings for Supabase
  const startISO = startOfDay.toISOString()
  const endISO = endOfDay.toISOString()

  const { count, error } = await supabase
    .from('news')
    .select('id', { count: 'exact', head: true })
    .gte('created_at', startISO)
    .lt('created_at', endISO)
    .not('body', 'is', null)

  if (error) {
    console.error("Error fetching today's posts:", error)
    return
  }

  todaysPosts.value = count || 0
}

// New code for title section
const currentTime = ref(new Date())
const formattedTime = computed(() => {
  return new Intl.DateTimeFormat(undefined, {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    timeZoneName: 'short',
  }).format(currentTime.value)
})

onMounted(() => {
  // Initial fetch
  fetchTodaysPosts()

  // Update time every minute
  const timeTimer = setInterval(() => {
    currentTime.value = new Date()
  }, 60000)

  // Update post count every 5 minutes
  const postTimer = setInterval(() => {
    fetchTodaysPosts()
  }, 300000)

  onUnmounted(() => {
    clearInterval(timeTimer)
    clearInterval(postTimer)
  })
})

// Calculate posts from today
const todaysPosts = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  return news.value.filter((post) => {
    const postDate = new Date(post.created_at)
    postDate.setHours(0, 0, 0, 0)
    return postDate.getTime() === today.getTime()
  }).length
})

// Refresh post count when new posts are loaded
watch(
  () => proxyNews.value.length,
  () => {
    fetchTodaysPosts()
  },
)

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

onMounted(async () => {
  await initBookmarks()
})

const route = useRoute()
watch(
  () => route.path,
  async () => {
    await initBookmarks()
  },
)

definePageMeta({
  name: 'News',
})
</script>

<template>
  <div>
    <!-- New title section -->
    <div class="bg-gray-900 border-b border-gray-800">
      <div class="max-w-[940px] mx-auto px-4 py-6 md:px-8">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-bold text-white">News Feed</h1>
          <div class="text-gray-400 text-sm space-y-1 text-right">
            <div>{{ formattedTime }}</div>
            <div>{{ todaysPosts }} posts today</div>
          </div>
        </div>
      </div>
    </div>
    <IBInfiniteScroll @update:scroll-end="loadMore()">
      <div
        class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
      >
        <NewsCard
          v-for="(item, i) in news"
          :key="`news-post-${i}`"
          :news="item"
        />
        <NewsCardSkeleton v-show="isLoading" />
      </div>
    </IBInfiniteScroll>
  </div>
</template>

<style scoped></style>
