<template>
  <div class="flex flex-col gap-4 lg:rounded-md border p-4 foreground border-color origin-left animate-swipe-in">
    <h3 class="text-2xl"> {{ post.title }}</h3>
    <div class="flex gap-2 text-sm whitespace-nowrap flex-wrap">
      <UBadge>{{ post.category.name }}</UBadge>
      <UBadge
        v-for="tag in post.tags?.slice(0, 2)"
        :key="tag.id"
        color="rose"
      >
        {{ tag.name }}
      </UBadge>
    </div>
    <UTooltip :text="post.media ? post.media[0].caption?.substring(0, 240) + '...' : 'No caption'">
      <div class="h-64 w-full overflow-hidden">
        <ImageWithFallback
          :image="post.media ? post.media[0] : undefined"
          :sizes="{ width: 500, height: 280, sizes: undefined }"
        />
      </div>
    </UTooltip>
    <div class="flex gap-2 text-sm">
      <p class="font-semibold">Credit:</p>
      <p>{{ post.author.name }},</p>
      <p>{{ post.published || '12th Dec, 2023' }}</p>
    </div>
    <div v-if="post.summary[summaryLevel]">
      <ul class="space-y-2">
        <li
          v-for="sum in post.summary[summaryLevel]"
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
</template>

<script setup lang="ts">
import { News } from '@/types/zod/news'

defineProps({
  post: {
    type: Object as () => News,
    required: true
  },
  summaryLevel: {
    type: String,
    required: true
  }
})
</script>
