<script setup lang="ts">
import { ref } from 'vue'
import { useNewsStore, type NewsCategory } from '@/stores/useNewsStore'

const categories: { id: NewsCategory; label: string; icon: string }[] = [
  { id: 'all', label: 'All News', icon: 'mdi:newspaper-variant-multiple-outline' },
  { id: 'discoveries', label: 'Discoveries', icon: 'mdi:telescope' },
  { id: 'events', label: 'Events', icon: 'mdi:calendar-star' },
  { id: 'research', label: 'Research', icon: 'mdi:flask-outline' },
  { id: 'new', label: 'New', icon: 'mdi:clock-outline' },
  { id: 'hot', label: 'Hot', icon: 'mdi:fire' },
]

const newsStore = useNewsStore()

const onCategoryChange = (category: NewsCategory) => {
  newsStore.setCategory(category)
}
</script>

<template>
  <div
    class="relative overflow-hidden bg-primary-900/40 backdrop-blur-sm border border-primary-800/30 rounded-xl py-2 px-4 mb-6"
  >
    <div class="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
      <PrimeButton
        v-for="category in categories"
        :key="category.id"
        :outlined="newsStore.filters.category !== category.id"
        :class="[
          'flex items-center gap-2 whitespace-nowrap',
          newsStore.filters.category === category.id ? 'bg-primary-600' : 'hover:bg-primary-900',
        ]"
        @click="onCategoryChange(category.id)"
      >
        <Icon
          :name="category.icon"
          class="w-5 h-5"
        />
        <span>{{ category.label }}</span>
      </PrimeButton>
    </div>
  </div>
</template>

<style scoped>
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
