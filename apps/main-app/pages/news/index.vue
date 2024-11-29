<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

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
  storeKey: 'mainNewsFeed',
})

const { items: proxyNews } = storeToRefs(store)

const news = computed(() => proxyNews.value.map((item) => toRaw(item)))

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({
  name: 'News',
})
</script>

<template>
  <div>
    <FeedTitle title="News Feed" />
    <BlackFridayBanner />

    <!-- News Content -->
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
