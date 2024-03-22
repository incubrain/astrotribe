<script setup lang="ts">
import type { NewsCategoryT } from '@/types/news'

const p = defineProps({
  newsCategory: {
    type: String as PropType<NewsCategoryT>,
    required: true
  }
})

const { data: spaceNews, error } = await useFetch(`/api/news/${p.newsCategory}`)

if (error.value) {
  console.error(error.value)
}

console.log('spaceNews', spaceNews)
</script>
<template>
  <div>
    <h2 class="text-xl fong-bold py-4"> Latest {{ newsCategory.toUpperCase() }} News </h2>
    <div
      v-if="spaceNews?.news"
      class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8"
    >
      <div
        v-for="news in spaceNews.news"
        :key="`space-news-${news.id}`"
        class="rounded-md border border-color background flex flex-col justify-between"
      >
        <div>
          <div
            v-if="news.featured_image"
            class="overflow-hidden sm:h-48"
          >
            <NuxtImg
              :src="news.featured_image"
              :alt="news.title"
              fit="cover"
              class="rounded-t-md object-cover object-center w-full h-full aspect-video"
              width="420"
              height="220"
            />
          </div>
          <div
            v-else
            class="overflow-hidden sm:h-48"
          >
            <NuxtImg
              :src="`images/news/${newsCategory}-placeholder.jpg`"
              :alt="news.title"
              fit="cover"
              class="rounded-t-md object-cover object-center w-full h-full aspect-video"
              width="420"
              height="220"
            />
          </div>
          <div class="space-y-3 p-4">
            <div class="flex gap-2">
              <span
                v-if="news.published_at"
                class="p-2 text-sm w-auto"
              >
                {{ useTimeAgo(news.published_at).value }}
              </span>
            </div>
            <h4 class="text-balance text-xl"> {{ news.title.slice(0, 80) }}... </h4>
            <p
              v-if="news.description"
              class="text-sm"
            >
              {{ news.description }}
            </p>
          </div>
        </div>
        <div class="p-4 flex justify-end items-center">
          <NuxtLink
            :to="news.url"
            target="_blank"
            rel="noopener"
          >
            <PrimeButton
              :label="`Read on ${newsCategory.toUpperCase()}`"
              size="small"
              outlined
            />
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
