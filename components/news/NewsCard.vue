<script setup lang="ts">
import type { NewsCardT } from '@/types/news'

defineProps({
  news: {
    type: Object as () => NewsCardT,
    required: true
  }
  // summaryLevel: {
  //   type: String,
  //   required: true
  // }
})
</script>

<template>
  <div class="rounded-md border border-color background flex flex-col justify-between">
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
          :src="`images/news/${news.source}-placeholder.jpg`"
          :alt="news.title"
          fit="cover"
          class="rounded-t-md object-cover object-center w-full h-full aspect-video"
          width="420"
          height="220"
        />
      </div>
      <div class="space-y-3 p-4">
        <div class="flex gap-2">
          <span class="text-sm w-auto">
            {{ useTimeAgo(news.published_at ?? news.created_at).value }}
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
          :label="`Read on ${news.source.toUpperCase()}`"
          size="small"
          outlined
        />
      </NuxtLink>
    </div>
  </div>
</template>
