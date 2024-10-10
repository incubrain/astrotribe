<script setup lang="ts">
import { useTimeAgo } from '@vueuse/core'
import type { NewsCardT } from '@/types/news'

defineProps({
  news: {
    type: Object as () => NewsCardT,
    required: true,
  },
})
</script>

<template>
  <div class="border-color border-b pt-4">
    <div class="flex gap-4 p-6">
      <IBImage
        :img="{
          src: `companies/${news.source}-logo.jpg`,
          alt: news.title,
          width: '60',
          height: '60',
        }"
        class="rounded-full"
      />
      <div class="justify-center-center flex flex-col gap-2">
        <div class="flex gap-2">
          <PrimeTag>
            {{ news.companies?.name }}
          </PrimeTag>
          <IBNewLabel
            :date="news.published_at ?? news.created_at!"
            :max-age="2"
          />
        </div>
        <span class="w-auto text-sm">
          {{ useTimeAgo(news.published_at ?? news.created_at).value }}
        </span>
      </div>
    </div>
    <!-- <div
      v-if="news.featured_image"
      class="overflow-hidden w-full"
    >
      <IBImage
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
      <div class="w-full" />
      <h4 class="text-balance text-xl">
        {{ news.title }}
      </h4>
      <p
        v-if="news.description"
        class="text-sm"
      >
        {{ news.description }}
      </p>
      <div class="flex w-full justify-end p-2">
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
