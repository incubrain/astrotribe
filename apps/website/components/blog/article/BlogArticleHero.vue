<script setup lang="ts">
defineProps({
  article: {
    type: Object,
    required: true,
  },
  authors: {
    type: Array,
    default: () => [],
  },
})
</script>

<template>
  <div class="foreground relative flex w-full items-center justify-center pb-12 pt-16">
    <div class="flex w-full max-w-[1140px] flex-col">
      <!-- <IBBreadcrumbs class="px-4 py-10" /> -->
      <!-- Update image handling for Nuxt Content -->
      <BlogMedia
        v-if="article.cover?.url"
        :url="article.cover.url"
        :alt="article.cover.alternativeText || article.title"
        :width="article.cover.width"
        :height="article.cover.height"
        class="relative md:rounded-md"
      />
      <div
        class="flex w-full flex-col items-start justify-between gap-12 rounded-md p-3 md:flex-row-reverse"
      >
        <div class="flex flex-wrap gap-4">
          <PrimeTag
            v-if="article.category"
            :value="article.category.name"
            class="text-nowrap text-sm"
          />
          <PrimeTag
            v-for="tag in article.tags"
            :key="tag.name"
            :value="tag.name"
            class="text-nowrap text-sm"
          />
        </div>
        <BlogArticleAuthor
          v-if="authors.length > 0"
          :authors="authors"
          :published-at="article.createdAt || article.publishedAt"
        />
      </div>
      <div
        class="padded-x relative z-10 mx-auto flex w-full max-w-[740px] flex-col items-start gap-8 rounded-md pt-8"
      >
        <h1 class="font-[Oswald] text-4xl font-semibold lg:text-center xl:text-5xl">
          {{ article.title }}
        </h1>
        <div class="border-color w-full rounded-md border p-4 xl:p-8 bg-primary-950">
          <p class="text-xl">
            {{ article.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
