<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const domainKey = 'news'
const { store, loadMore, refresh } = useSelectData<News>('news', {
  columns:
    'id, title, body, published_at, created_at, description, category_id, author, url, keywords, featured_image, company_id, companies(*)',
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

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({
  name: 'News',
})
</script>

<template>
  <div>
    <IBInfiniteScroll @update:scroll-end="loadMore()">
      <div
        class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
      >
        <div class="col-span-full w-full justify-between flex">
          <PrimeButton @click="refresh()"> Feed Categories </PrimeButton>
          <PrimeButton
            link
            @click="refresh()"
          >
            Feed Settings
          </PrimeButton>
        </div>
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
