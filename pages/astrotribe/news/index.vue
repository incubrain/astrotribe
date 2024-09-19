<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow news to toggle summary level
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue

const domainKey = 'news'
const { store, loadMore, refresh } = await useSelectData<User>('news', {
  columns:
    'id, title, body, published_at, created_at, description, category_id, author, url, keywords, featured_image, company_id, companies(*)',
  filters: { content_status: 'draft' },
  orderBy: { column: 'created_at', ascending: false },
  initialFetch: true,
  pagination: { page: 1, limit: 20 },
})

const { items: news } = storeToRefs(store)

console.log('news', news)

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({
  name: 'News',
  layout: 'app',
})
</script>

<template>
  <div>
    <!-- <IbFilter data-type="news" /> -->
    <!-- <NewsSummaryLevel /> -->
    <IbInfiniteScroll @update:scroll-end="loadMore()">
      <div class="grid grid-cols-1 md:grid-cols-[1fr_minmax(200px,480px)_1fr]">
        <IbSidebar class="mx-auto" />
        <div class="mx-auto flex w-full max-w-sm flex-col md:col-start-2">
          <NewsCard
            v-for="(item, i) in news"
            :key="`news-post-${i}`"
            :news="item"
          />
          <NewsCardSkeleton v-show="isLoading" />
        </div>
        <IbAdvertisement />
      </div>
    </IbInfiniteScroll>
  </div>
</template>

<style scoped></style>
