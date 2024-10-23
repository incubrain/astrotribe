<script setup lang="ts">
const route = useRoute()
const feedId = computed(() => String(route.params.feed))

const { store: categoriesStore } = useSelectData('feed_categories', {
  columns: 'id, feed_id, categories(id, name)',
  filters: {
    feed_id: { eq: feedId.value },
  },
  orderBy: { column: 'created_at', ascending: false },
  initialFetch: true,
})

const { items: proxyCategories } = storeToRefs(categoriesStore)

const categories = computed(() => proxyCategories.value.map((item) => toRaw(item).categories))

const news = ref([])
const newsStore = ref(null)
const loadMoreFunc = ref(null)

const domainKey = 'news'

watch(
  categories,
  (newCategories) => {
    if (newCategories.length) {
      news.value = []

      const { store, loadMore, refresh } = useSelectData<News>('news', {
        columns:
          'id, title, body, published_at, created_at, description, category_id, author, url, keywords, featured_image, company_id, companies(*)',
        filters: {
          category_id: { in: newCategories.map((category) => category.id) },
        },
        orderBy: { column: 'created_at', ascending: false },
        initialFetch: true,
      })

      newsStore.value = store
      loadMoreFunc.value = loadMore

      // Update news when store items change
      watch(
        () => store.items,
        (newItems) => {
          news.value = newItems.map((item) => toRaw(item))
        },
        { immediate: true },
      )
    } else {
      news.value = []
      newsStore.value = null
      loadMoreFunc.value = null
    }
  },
  { immediate: true },
)

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
    <IBInfiniteScroll @update:scroll-end="loadMoreFunc && loadMoreFunc()">
      <div
        class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
      >
        <NewsCard
          v-for="(item, i) in news"
          :key="`news-post-${item.id}`"
          :news="item"
        />
        <NewsCardSkeleton v-show="isLoading" />
      </div>
    </IBInfiniteScroll>
  </div>
</template>

<style scoped></style>
