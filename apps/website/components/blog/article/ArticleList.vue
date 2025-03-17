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
  <div
    class="wrapper relative grid w-full grid-cols-1 items-start md:gap-4 lg:grid-cols-[0.5fr_1fr] lg:gap-8"
  >
    <BlogAdFloat />

    <div
      v-if="isLoading"
      class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
    >
      <BlogCardSkeleton
        v-for="i in 6"
        :key="i"
      />
    </div>

    <div
      v-else-if="articles && articles.length"
      class="grid h-full grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8"
    >
      <BlogCard
        v-for="article in articles"
        :key="`blog-article-${article.id}`"
        :article="article"
      />
    </div>
    <div
      v-else
      class="background flex w-full items-center justify-center border border-primary-500 p-8 md:rounded-md"
    >
      <p class="foreground px-2">No articles found...</p>
    </div>
  </div>
</template>
