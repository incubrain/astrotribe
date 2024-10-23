<script setup lang="ts">
const route = useRoute()
const feedId = computed(() => String(route.params.feed))
const client = useSupabaseClient()

const categories = ref([])
const getCategories = async () => {
  const { data } = await client
    .from('feed_categories')
    .select('id, categories(id, name)')
    .eq('feed_id', feedId.value)

  categories.value = data.map((item) => item.categories)
}

onMounted(getCategories)

const domainKey = 'news'
const { store, loadMore, refresh } = useSelectData<News>('news', {
  columns:
    'id, title, body, published_at, created_at, description, category_id, author, url, keywords, featured_image, company_id, companies(*)',
  filters: {
    category_id: { eq: '5', or: '4' },
    // content_status: { eq: 'draft' },
    // body: { neq: 'null' },
  },
  orderBy: { column: 'created_at', ascending: false },
  initialFetch: true,
  pagination: { page: 1, limit: 20 },
})

const { items: proxyNews } = storeToRefs(store)

const news = computed(() => proxyNews.value.map((item) => toRaw(item)))
console.log('NEWS', news)
const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))
</script>

<template>
  <PrimeButton
    v-for="(category, index) in categories"
    :key="index"
    color="primary"
    :aria-label="category.name"
    :label="category.name"
    size="small"
    class="m-2"
  />
  <div>
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
