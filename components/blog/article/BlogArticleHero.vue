<template>
  <div class="relative w-full flex justify-center items-center foreground pb-12">
    <div class="flex flex-col max-w-4xl">
      <Breadcrumbs class="py-12 px-4" />
      <NuxtImg
        :src="`images/blog/${article.category}/${article.featured_image}`"
        class="md:rounded-md relative"
        width="900px"
        height="506px"
      />
      <div
        class="flex flex-col md:flex-row-reverse gap-12 items-start p-3 rounded-md w-full justify-between"
      >
        <div class="space-x-2">
          <UBadge
            :label="article.category"
            color="primary"
            variant="solid"
            class="text-sm"
          />
          <UBadge
            v-for="tag in article.tags"
            :key="tag"
            :label="tag"
            color="secondary"
            variant="soft"
            class="text-sm"
          />
        </div>
        <BlogArticleAuthor
          :published-at="article.publishedAt"
          :author-id="article.authorIds[0]"
        />
      </div>
      <div
        class="flex relative z-10 gap-8 flex-col items-start mx-auto w-full rounded-md max-w-[740px] pt-8 padded-x"
      >
        <h1 class="text-4xl lg:text-5xl font-semibold font-[Oswald] lg:text-center">
          {{ article.title }}
        </h1>
        <div
          class="w-full p-4 lg:p-8 rounded-md border border-color bg-primary-50 dark:bg-primary-950"
        >
          <p class="text-xl">
            {{ article.description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleFullT } from '~/types/articles'

defineProps({
  article: {
    type: Object as PropType<ArticleFullT>,
    required: true
  }
})
</script>

<style scoped></style>
