<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:med - add loaders for news posts
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const newsStore = useNewsStore()
const { news } = storeToRefs(newsStore)
const haveNews = computed(() => news.value !== null && news.value.length > 0)
const loading = useLoadingStore()

const isLoading = computed(() => loading.isLoading('newsStore'))

const fetchInput = ref({
  storeKey: 'newsStore',
  endpoint: '/api/news/select/many',
  pagination: {
    page: 1,
    limit: 10
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
      :store-key="fetchInput.storeKey"
      :pagination="fetchInput.pagination"
      @update:scroll-end="newsStore.loadNews(fetchInput)"
    >
      <div
        v-if="haveNews"
        class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]"
      >
        <div class="w-full">
          <div class="md:sticky top-0 flex justify-center md:justify-start p-8">
            <PrimeInlineMessage
              severity="info"
              :pt="{ root: '', text: 'text-sm text-left' }"
            >
              News Filters Coming Soon
            </PrimeInlineMessage>
          </div>
        </div>
        <div class="flex flex-col max-w-sm md:col-start-2 mx-auto">
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
