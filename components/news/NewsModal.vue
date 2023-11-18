<template>
  <div class="foreground relative w-full h-full">
    <div
      class="sticky top-0 left-0 z-20 w-full background flex h-auto items-center justify-between px-4 py-2"
    >
      <h3 class="font-semibold text-sm lg:text-lg"> {{ posts[currentIndex].title }}</h3>
      <div class="flex gap-2 items-center">
        <UButton
          to="https://tailwindcss.com/docs/content"
          target="_blank"
          icon="i-material-symbols-chrome-reader-mode-rounded"
          class="lg:after:content-['Full_Article'] flex items-center justify-end"
        />
        <UButton
          icon="i-mdi-close"
          variant="link"
          @click="$emit('closeNewsModal')"
        />
      </div>
    </div>
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4 overflow-scroll w-full h-full py-4">
      <div class="grid grid-cols-2 xl:col-start-4 gap-4">
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
        class="xl:col-span-3 col-start-1 xl:row-start-1 xl:row-span-2 lg:mt-0"
      >
        <LazyImageCarousel
          :media="posts[currentIndex].media"
          class="w-full"
        />
      </div>
      <div
        v-else
        class="xl:col-span-3 col-start-1 xl:row-start-1 xl:row-span-2  overflow-hidden"
      >
        <ImageWithFallback
          :image="undefined"
          :options="{ width: 100, height: 60, quality: 50, sizes: undefined }"
        />
      </div>
      <div class="flex flex-col gap-4">
        <ul class="space-y-2 px-4 pb-8">
          <li
            v-for="sum in posts[currentIndex].summary[summaryLevel]"
            :key="sum"
            class="flex gap-2 items-start"
          >
            <UIcon
              name="i-mdi-star"
              class="text-yellow-500 w-3 h-3 flex-shrink-0 mt-[3px]"
            />
            <p class="flex-grow leading-snug text-sm">
              {{ sum }}
            </p>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsType } from '@/types/news'

defineProps({
  posts: {
    type: Array as () => NewsType[],
    required: true
  },
  currentIndex: {
    type: Number,
    required: true
  },
  summaryLevel: {
    type: String,
    required: true
  },
  nextIndex: {
    type: Number,
    required: true
  },
  previousIndex: {
    type: Number,
    required: true
  },
  nextPost: {
    type: Function,
    required: true
  },
  previousPost: {
    type: Function,
    required: true
  }
})
</script>
