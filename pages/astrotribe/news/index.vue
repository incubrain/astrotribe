<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const domainKey = 'news'
const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const haveNews = computed(() => news.value !== null && news.value.length > 0)

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

const fetchInput = ref({
  domainKey,
  endpoint: '/api/news/select/cards',
  pagination: {
    page: 1,
    limit: 20
  },
  criteria: {
    dto: 'select:news:card',
    filterBy: {
      columnName: 'source',
      operator: 'eq',
      value: 'nasa'
    }
  }
}) as Ref<FetchInput>

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
    <!-- <BaseFilter data-type="news" /> -->
    <!-- <NewsSummaryLevel /> -->
    <BaseInfiniteScroll
      :domain-key="domainKey"
      :pagination="fetchInput.pagination!"
      @update:scroll-end="newsStore.loadNews(fetchInput)"
    >
      <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]">
        <BaseSidebar class="mx-auto" />
        <div class="flex flex-col max-w-sm md:col-start-2 mx-auto w-full">
          <NewsCard
            v-for="(item, i) in news"
            :key="`news-post-${i}`"
            :news="item"
          />
          <NewsCardSkeleton v-show="isLoading" />
        </div>
      </div>
    </BaseInfiniteScroll>
  </div>
</template>

<style scoped></style>
