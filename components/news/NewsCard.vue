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
  <div class="border-b border-color pt-4">
    <div class="p-6 flex gap-4">
      <BaseImage
        :img="{
          src: `images/companies/${news.source}-logo.jpg`,
          alt: news.title,
          width: '60',
          height: '60'
        }"
        class="rounded-full"
      />
      <div class="flex flex-col gap-2 justify-center-center">
        <div class="flex gap-2">
          <PrimeTag>
            {{ news.source.toUpperCase() }}
          </PrimeTag>
          <BaseNewLabel
            :date="news.published_at ?? news.created_at!"
            :max-age="2"
          />
        </div>
        <span class="text-sm w-auto">
          {{ useTimeAgo(news.published_at ?? news.created_at).value }}
        </span>
      </div>
    </div>
    <!-- <div
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
    </div> -->
    <div class="flex flex-col gap-2 px-4 pb-4">
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
