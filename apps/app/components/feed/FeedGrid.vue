<!-- NewsFeedGrid.vue -->
<script setup lang="ts">
// Updated to handle the new unified content structure
defineProps<{
  items: Array<any> // Can be News, SponsoredAd, or any content type from the unified table
}>()
</script>

<template>
  <div
    class="mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:col-start-2 gap-4 md:gap-8 p-4 md:p-8 max-w-[940px]"
  >
    <template
      v-for="(item, index) in items"
      :key="item.id"
    >
      <div
        :id="`feed-item-${index}`"
        class="grid-item"
      >
        <NewsCard
          v-if="item.type !== 'sponsored'"
          :news="item"
        />
        <AdsFeedCard
          v-else
          :ad="item.content"
        />
      </div>
    </template>
  </div>
</template>
