<script setup lang="ts">
import type { NewsListGovernmentT } from '@/types/news'

const p = defineProps({
  newsCategory: {
    type: String as PropType<NewsListGovernmentT | 'all'>,
    required: true,
  },
})

const filterBy = computed(() =>
  p.newsCategory === 'all'
    ? null
    : {
        columnName: 'source',
        operator: 'eq',
        value: p.newsCategory,
      },
)

const { data: spaceNews, error } = await useAsyncData(
  'blog-news-cards',
  async () =>
    await $fetch('/api/news/select/cards', {
      method: 'GET',
      params: {
        filterBy: filterBy.value,
        dto: 'select:news:card',
        limit: 6,
      },
    }),
)

console.log('dataReturned', spaceNews, error)

if (error.value) {
  console.error(error.value)
}
</script>

<template>
  <div>
    <h2 class="pb-20 text-3xl font-bold underline decoration-primary-500 underline-offset-8">
      LATEST NEWS
    </h2>
    <div
      v-if="spaceNews?.data"
      class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8"
    >
      <NewsCard
        v-for="(news, i) in spaceNews.data"
        :key="`news-${news.source}-${i}`"
        :news="news"
      />
    </div>
    <NuxtLink
      class="flex w-full items-center justify-end gap-2 pt-20 hover:text-primary-500"
      to="/auth/register"
    >
      <h2 class="text-end text-3xl font-bold underline decoration-primary-500 underline-offset-8">
        JOIN FREE FOR MORE
      </h2>
      <Icon
        name="mdi:chevron-right"
        size="32px"
      />
    </NuxtLink>
  </div>
</template>

<style scoped></style>
