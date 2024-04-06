<script setup lang="ts">
// !todo:critical - add summaries for news articles
// !todo:high - allow users to toggle summary level
// !todo:high - add news posts to pinia store
// !todo:med - add loaders for news posts
// !todo:bug:critical - infinite scroll is loading duplicate posts with pagination, probably a supabase issue
const dataFinished = ref(false)
const allData = ref([])
const pagination = reactive({ from: 0, to: 19, limit: 20 })

const countDuplicatePosts = (data) => {
  const ids = data.map((item) => item.id)
  const uniqueIds = new Set(ids)
  return ids.length - uniqueIds.size
}

const { error, pending, refresh } = await useAsyncData('news', async () => {
  const { news } = await $fetch('/api/news/all', {
    query: { from: pagination.from, to: pagination.to }
  })

  console.log('fired again')

  if (!news || !news.length || news.length < pagination.limit) {
    console.log('dataFinished', news?.length, pagination.to, pagination.from)
    dataFinished.value = true
  }

  if (!news || !news.length) {
    return
  }

  // these are 0 indexed
  pagination.from += pagination.limit
  pagination.to += pagination.limit
  await new Promise((resolve) => setTimeout(resolve, 1200))
  allData.value.push(...news)
  console.log('Duplicates', allData.value.length, countDuplicatePosts(allData.value))
})

if (error.value) {
  console.error(error.value)
}

definePageMeta({
  name: 'News',
  layout: 'app'
})
</script>

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
