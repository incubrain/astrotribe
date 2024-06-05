<template>
  <div class="foreground relative flex w-full items-center justify-center pb-12 pt-16">
    <div class="flex max-w-[1140px] flex-col w-full">
      <BaseBreadcrumbs class="px-4 py-10" />
      <BaseImage
        :img="{
          src: `images/blog/${article.category}/${article.featured_image}`,
          width: '1140px',
          height: '700px'
        }"
        class="relative md:rounded-md"
      />
      <div
        class="flex w-full flex-col items-start justify-between gap-12 rounded-md p-3 md:flex-row-reverse"
      >
        <div class="flex flex-wrap gap-4">
        <PrimeTag
            :value="article.category"
            class="text-nowrap text-sm"
          />
          <PrimeTag
            v-for="tag in article.tags"
            :key="tag"
            :value="tag"
            severity="secondary"
            class="text-nowrap text-sm"
          />
        </div>
        <BlogArticleAuthor
          :published-at="article.publishedAt"
          :author-id="article.authorIds[0]"
        />
      </div>
      <div
        class="padded-x relative z-10 mx-auto flex w-full max-w-[740px] flex-col items-start gap-8 rounded-md pt-8"
      >
        <h1 class="font-[Oswald] text-4xl font-semibold lg:text-center xl:text-5xl">
          {{ article.title }}
        </h1>
        <div
          class="border-color w-full rounded-md border bg-primary-50 p-4 xl:p-8 dark:bg-primary-950"
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
