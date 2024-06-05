<template>
  <div class="relative w-full flex justify-center items-center foreground pb-12 pt-16">
    <div class="flex flex-col max-w-4xl">
      <BaseBreadcrumbs class="py-10 px-4" />
      <BaseImage
        :img="{
          src: `images/blog/${article.category}/${article.featured_image}`,
          width: '900px',
          height: '506px'
        }"
        class="md:rounded-md relative"
      />
      <div
        class="flex flex-col md:flex-row-reverse gap-12 items-start p-3 rounded-md w-full justify-between"
      >
        <div class="flex gap-4 flex-wrap">
          <PrimeTag
            :value="article.category"
            class="text-sm text-nowrap"
          />
          <PrimeTag
            v-for="tag in article.tags"
            :key="tag"
            :value="tag"
            severity="secondary"
            class="text-sm text-nowrap"
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
        <h1 class="text-4xl xl:text-5xl font-semibold font-[Oswald] lg:text-center">
          {{ article.title }}
        </h1>
        <div
          class="w-full p-4 xl:p-8 rounded-md border border-color bg-primary-50 dark:bg-primary-950"
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
