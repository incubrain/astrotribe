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
  <BaseHoverCard>
    <div>
      <!-- <div
        v-if="news.featured_image"
        class="overflow-hidden sm:h-48"
      >
        <BaseImage
        :img="{
          src: news.featured_image,
          alt: news.title,
          fit: 'cover',
          width: '420',
          height: '220',
        }"
        class="rounded-t-md object-cover object-center w-full h-full aspect-video"
        />
      </div> -->
      <!-- <div
        v-else
        class="overflow-hidden sm:h-48"
      >
        <BaseImage
        :img="{
          src: `images/news/${news.source}-placeholder.jpg`,
          alt: news.title,
          fit: 'cover',
          width: '420',
          height: '220',
        }"
        class="rounded-t-md object-cover object-center w-full h-full aspect-video"
        />
      </div> -->
      <div class="space-y-3">
        <div class="flex gap-2 items-center justify-between">
          <PrimeTag>
            {{ news.source.toUpperCase() }}
          </PrimeTag>
          <span class="text-sm w-auto">
            {{ useTimeAgo(news.published_at ?? news.created_at).value }}
          </span>
          <NuxtLink
            :to="news.url"
            target="_blank"
            rel="noopener"
          >
            <PrimeButton
              label="Read more"
              size="small"
              text
            />
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      class="flex flex-col gap-2 pb-4 group-hover:max-h-none group-hover:overflow-scroll overflow-hidden"
    >
      <h4
        class="text-balance text-xl md:max-h-16 group-hover:max-h-none group-hover:overflow-visible overflow-hidden"
      >
        {{ news.title }}
      </h4>
      <p
        v-if="news.description"
        class="text-sm max-h-none md:max-h-4 overflow-hidden lg:group-hover:max-h-none lg:group-hover:overflow-visible"
      >
        {{ news.description }}
      </p>
    </div>
  </BaseHoverCard>
</template>
