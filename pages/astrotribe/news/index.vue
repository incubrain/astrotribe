<template>
  <div class="flex flex-col relative h-full w-full">
    <!-- <NewsSummaryLevel /> -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      <NewsCard
        v-for="(news, i) in data.news"
        :key="`news-post-${i}`"
        :news="news"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
// const news = useNewsStore()
// const { posts } = storeToRefs(news)

const { data, error } = await useFetch('/api/news/all')

if (error.value) {
  console.error(error.value)
}

definePageMeta({
  name: 'News',
  layout: 'app'
})
</script>
