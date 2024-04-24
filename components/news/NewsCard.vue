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
  <div class="border-b border-color">
    <div class="p-6 flex gap-4">
      <BaseImage
        :img="{
          src: `images/companies/nasa-logo.jpg`,
          alt: news.title,
          width: '60',
          height: '60'
        }"
        class="rounded-full"
      />
      <div class="flex flex-col gap-2 justify-center-center">
        <PrimeTag>
          {{ news.source.toUpperCase() }}
        </PrimeTag>
        <span class="text-sm w-auto">
          {{ useTimeAgo(news.published_at ?? news.created_at).value }}
        </span>
      </div>
    </div>
    <div
      v-if="news.featured_image"
      class="overflow-hidden w-full"
    >
      <BaseImage
        :img="{
          src: news.featured_image,
          alt: news.title,
          fit: 'cover',
          width: '220',
          height: '220'
        }"
        class="rounded-t-md object-cover object-center w-full h-full"
      />
    </div>
    <div
      v-else
      class="overflow-hidden sm:h-48"
    >
      <BaseImage
        :img="{
          src: `images/news/${news.source}-placeholder.jpg`,
          alt: news.title,
          fit: 'cover',
          width: '220',
          height: '220'
        }"
        class="rounded-t-md object-cover object-center w-full h-full aspect-video"
      />
    </div>
    <div class="flex flex-col gap-2 p-4">
      <div class="w-full"> </div>
      <h4 class="text-balance text-xl">
        {{ news.title }}
      </h4>
      <p
        v-if="news.description"
        class="text-sm"
      >
        {{ news.description }}
      </p>
      <div class="w-full flex justify-end p-2">
        <NuxtLink
          :to="news.url"
          target="_blank"
          rel="noopener"
        >
          <PrimeButton
            label="Read more"
            size="small"
            outlined
          />
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
