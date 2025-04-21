<script setup lang="ts">
import { computed, defineProps } from 'vue'

interface BlogMediaProps {
  url: string
  alt?: string
  width?: number
  height?: number
}

// Props
const props = defineProps<BlogMediaProps>()

// Check if URL is YouTube or Vimeo
const videoType = computed(() => {
  if (!props.url) return null
  if (props.url.includes('youtube.com') || props.url.includes('youtu.be')) return 'youtube'
  if (props.url.includes('vimeo.com')) return 'vimeo'
  return null
})

// Create embeddable URL
const embedUrl = computed(() => {
  if (!videoType.value) return props.url

  if (videoType.value === 'youtube') {
    const videoId = props.url.split('v=')[1] || ''
    return `https://www.youtube.com/embed/${videoId}`
  }

  if (videoType.value === 'vimeo') {
    const videoId = props.url.split('/').pop() || ''
    return `https://player.vimeo.com/video/${videoId}`
  }

  return props.url
})
</script>

<template>
  <div class="aspect-video w-full">
    <!-- Video (YouTube or Vimeo) -->
    <iframe
      v-if="videoType"
      :src="embedUrl"
      frameborder="0"
      allowfullscreen
      class="h-full w-full object-cover"
    />
    <!-- Image -->
    <NuxtImg
      v-else
      :src="url.replace('/uploads/', '')"
      :alt="alt || 'Blog Media'"
      :width="width"
      :height="height"
      class="h-full w-full object-contain"
    />
  </div>
</template>
