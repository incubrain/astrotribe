<script setup lang="ts">
defineProps<{
  news: NewsItem
}>()

const viewStore = useViewModeStore()
</script>

<template>
  <NewsCardGrid
    v-if="viewStore.viewMode === 'grid'"
    :news="news"
  />

  <NewsCardList
    v-else
    :news="news"
  />
</template>
