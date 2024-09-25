<template>
  <div class="foreground relative h-full w-full">
    <div
      class="background sticky left-0 top-0 z-20 flex h-auto w-full items-center justify-between px-4 py-2"
    >
      <h3 class="lg:text-lg text-sm font-semibold">
        {{ posts[currentIndex].title }}
      </h3>
      <div class="flex items-center gap-2">
        <PrimeButton
          to="https://tailwindcss.com/docs/content"
          target="_blank"
          icon="material-symbols:chrome-reader-mode-rounded"
          class="flex items-center justify-end lg:after:content-['Full_Article']"
        />
        <PrimeButton
          icon="mdi:close"
          variant="link"
          @click="$emit('closeNewsModal')"
        />
      </div>
    </div>
    <div class="grid h-full w-full grid-cols-1 gap-4 overflow-scroll py-4 xl:grid-cols-4">
      <div class="grid grid-cols-2 gap-4 xl:col-start-4">
        <NewsNavigationButton
          :condition="nextIndex <= posts.length - 1"
          :is-prev="true"
          :post="posts[nextIndex]"
          :handle-click="nextPost"
        />
        <NewsNavigationButton
          :condition="previousIndex >= 0"
          :post="posts[previousIndex]"
          :handle-click="previousPost"
        />
      </div>
      <div
        v-if="posts[currentIndex].media"
        class="col-start-1 lg:mt-0 xl:col-span-3 xl:row-span-2 xl:row-start-1"
      >
        <LazyImageCarousel
          :media="posts[currentIndex].media"
          class="w-full"
        />
      </div>
      <div
        v-else
        class="col-start-1 overflow-hidden xl:col-span-3 xl:row-span-2 xl:row-start-1"
      >
        <IBImageWithFallback
          :image="undefined"
          :options="{ width: 100, height: 60, quality: 50, sizes: undefined }"
        />
      </div>
      <div class="flex flex-col gap-4">
        <ul class="space-y-2 px-4 pb-8">
          <li
            v-for="sum in posts[currentIndex].summary[summaryLevel]"
            :key="sum"
            class="flex items-start gap-2"
          >
            <Icon
              name="mdi:star"
              class="mt-[3px] flex-shrink-0 text-yellow-500"
              size="18px"
            />
            <p class="flex-grow text-sm leading-snug">
              {{ sum }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsCardT } from '@/types/news'

defineProps({
  posts: {
    type: Array as () => NewsCardT[],
    required: true,
  },
  currentIndex: {
    type: Number,
    required: true,
  },
  summaryLevel: {
    type: String,
    required: true,
  },
  nextIndex: {
    type: Number,
    required: true,
  },
  previousIndex: {
    type: Number,
    required: true,
  },
  nextPost: {
    type: Function,
    required: true,
  },
  previousPost: {
    type: Function,
    required: true,
  },
})
</script>
