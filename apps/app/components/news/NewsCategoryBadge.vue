<script setup lang="ts">
import { computed } from 'vue'
import type { NewsCategory } from '@/stores/useNewsStore'

const props = defineProps<{
  category: string
}>()

// Map categories to colors and icons
const categoryConfig = computed(() => {
  const category = props.category.toLowerCase()

  const config = {
    discoveries: {
      bg: 'bg-blue-500/20',
      border: 'border-blue-500/30',
      text: 'text-blue-400',
      icon: 'mdi:telescope',
    },
    events: {
      bg: 'bg-purple-500/20',
      border: 'border-purple-500/30',
      text: 'text-purple-400',
      icon: 'mdi:calendar-star',
    },
    research: {
      bg: 'bg-green-500/20',
      border: 'border-green-500/30',
      text: 'text-green-400',
      icon: 'mdi:flask-outline',
    },
    hot: {
      bg: 'bg-red-500/20',
      border: 'border-red-500/30',
      text: 'text-red-400',
      icon: 'mdi:fire',
    },
    new: {
      bg: 'bg-yellow-500/20',
      border: 'border-yellow-500/30',
      text: 'text-yellow-400',
      icon: 'mdi:clock-outline',
    },
    // Default fallback
    default: {
      bg: 'bg-gray-500/20',
      border: 'border-gray-500/30',
      text: 'text-gray-400',
      icon: 'mdi:tag-outline',
    },
  }

  return config[category as keyof typeof config] || config.default
})
</script>

<template>
  <div
    class="inline-flex items-center px-2 py-1 rounded-full text-xs"
    :class="[categoryConfig.bg, categoryConfig.border, categoryConfig.text]"
  >
    <Icon
      :name="categoryConfig.icon"
      class="w-3 h-3 mr-1"
    />
    <span>{{ category }}</span>
  </div>
</template>
