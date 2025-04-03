<script setup lang="ts">
const props = defineProps({
  articles: {
    type: Array,
    required: true,
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="wrapper relative w-full py-8">
    <div
      v-if="isLoading"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <BlogCardSkeleton
        v-for="i in 12"
        :key="i"
      />
    </div>

    <div
      v-else-if="articles && articles.length"
      class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      <BlogCardGlass
        v-for="article in articles"
        :key="`blog-article-${article.id}`"
        :article="article"
      />
    </div>

    <div
      v-else
      class="background flex w-full items-center justify-center border border-primary-500 p-8 rounded-lg"
    >
      <p class="foreground px-2">No articles found...</p>
    </div>
  </div>
</template>
