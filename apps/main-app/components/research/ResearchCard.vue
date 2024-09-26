<template>
  <div class="rounded-md border border-color background flex flex-col justify-between">
    <div>
      <div class="space-y-3 p-4">
        <div class="flex gap-2">
          <span class="text-sm w-auto">
            {{ useTimeAgo(research.published_at ?? research.created_at).value }}
          </span>
        </div>
        <h4 class="text-balance text-xl"> {{ research.title.slice(0, 120) }}... </h4>
        <p
          v-if="research.description"
          class="text-sm"
        >
          {{ research.description.slice(0, 360) }}...
        </p>
      </div>
    </div>
    <div class="p-4 flex justify-end items-center">
      <NuxtLink
        :to="`${research.url}v${research.version}`"
        target="_blank"
        rel="noopener"
      >
        <PrimeButton
          label="Read on Axive"
          size="small"
          outlined
        />
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { NewsCardT } from '@/types/news'

defineProps({
  research: {
    type: Object as () => NewsCardT,
    required: true,
  },
  // summaryLevel: {
  //   type: String,
  //   required: true
  // }
})
</script>
