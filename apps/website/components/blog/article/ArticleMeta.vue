<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

// Format date
const formattedDate = computed(() => {
  const dateStr = props.article.date || props.article.publishedAt
  return dateStr ? useDateFormat(dateStr, 'DD MMM YYYY').value : ''
})

// Calculate reading time
const readingTime = computed(() => {
  if (!props.article.body?.children) return '1 min read'

  // Extract text content from the article body
  const text = JSON.stringify(props.article.body)

  // Average reading speed: 200 words per minute
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)

  return `${minutes} min read`
})
</script>

<template>
  <div
    class="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 text-sm text-gray-500"
  >
    <div class="flex items-center gap-3">
      <!-- Author with Avatar -->
      <div
        v-if="article.author"
        class="flex items-center gap-2"
      >
        <IBImage
          v-if="article.author?.avatar?.url"
          :img="{
            src: article.author.avatar.url,
            alt: `${article.author.name} avatar`,
            width: '32',
            height: '32',
          }"
          class="rounded-full border border-gray-300"
        />
        <span class="font-medium">{{ article.author.name }}</span>
      </div>

      <!-- Date -->
      <div
        v-if="formattedDate"
        class="flex items-center gap-1"
      >
        <Icon
          name="i-lucide-calendar"
          class="w-4 h-4"
        />
        <span>{{ formattedDate }}</span>
      </div>
    </div>

    <!-- Reading Time -->
    <div class="flex items-center gap-1">
      <Icon
        name="i-lucide-clock"
        class="w-4 h-4"
      />
      <span>{{ readingTime }}</span>
    </div>
  </div>
</template>
