<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:med - add loaders for news posts
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const haveNews = computed(() => news.value.length > 0)

const paginationStore = usePaginationStore()

const fetchInput = ref({
  storeKey: 'newsStore',
  endpoint: '/api/news/many',
  criteria: {
    dto: 'select:news:card',
    pagination: paginationStore.getPaginationRange('newsStore'),
    filters: [
      {
        type: 'eq',
        field: 'source',
        value: 'nasa'
      }
    ]
  }
})

watchEffect(() => {
  if (haveNews.value === false) {
    console.log('Fetching news')
    newsStore.loadNews(fetchInput.value)
  }
})

console.log('news', news)

definePageMeta({
  name: 'News',
  layout: 'app'
})
</script>

<template>
  <div class="flex flex-col relative h-full w-full md:gap-4 xl:gap-8">
    <BaseFilter data-type="news" />
    <!-- <NewsSummaryLevel /> -->
    <BaseInfiniteScroll
      store-key="newsStore"
      :pagination="{
        page: 1,
        limit: 10
      }"
      @update:scroll-end="newsStore.loadNews(fetchInput)"
    >
      <div
        v-if="haveNews"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
      >
        <NewsCard
          v-for="(item, i) in news"
          :key="`news-post-${i}`"
          :news="item"
        />
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
