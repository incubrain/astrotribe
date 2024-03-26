<script setup lang="ts">
import type { NewsListGovernmentT } from '@/types/news'

const p = defineProps({
  newsCategory: {
    type: String as PropType<NewsListGovernmentT>,
    required: true
  }
})

const { data: spaceNews, error } = await useFetch(`/api/news/${p.newsCategory}`)

if (error.value) {
  console.error(error.value)
}
</script>
<template>
  <div>
    <h2
      class="text-3xl font-bold pb-10 underline underline-offset-8 decoration-primary-500 text-center"
    >
      {{ newsCategory.toUpperCase() }} NEWS
    </h2>
    <div
      v-if="spaceNews?.news"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <NewsCard
        v-for="(news, i) in spaceNews.news"
        :key="`news-${news.source}-${i}`"
        :news="news"
      />
    </div>
  </div>
</template>

<style scoped></style>
