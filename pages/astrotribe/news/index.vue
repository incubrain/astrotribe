<template>
  <div class="flex flex-col relative h-full w-full">
    <!-- <NewsSummaryLevel /> -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 mx-auto md:gap-4 xl:gap-8">
      <NewsCard
        v-for="(news, i) in allData"
        :key="`news-post-${i}`"
        :news="news"
      />
    </div>
    <AppDetectBottom
      v-show="!dataFinished && !pending"
      @bottom-trigger="refresh"
    />
  </div>
</template>

<script setup lang="ts">
const dataFinished = ref(false)
const allData = ref([])
const pagination = reactive({ skip: 0, limit: 19 })

const { error, pending, refresh } = await useAsyncData('news', async () => {
  const { news } = await $fetch('/api/news/all', {
    query: { skip: pagination.skip, limit: pagination.limit }
  })

  console.log('fired again')

  if (!news || !news.length || news.length < pagination.limit) {
    dataFinished.value = true
    return
  }

  pagination.skip += pagination.limit
  await new Promise((resolve) => setTimeout(resolve, 1200))
  allData.value.push(...news)
})

if (error.value) {
  console.error(error.value)
}

definePageMeta({
  name: 'News',
  layout: 'app'
})
</script>
