<script setup lang="ts">
import type { QueryBuilderParams } from '@nuxt/content/dist/runtime/types'
import type { ArticleCategoriesT, ArticleCardT } from '~/types/articles'
import { ARTICLE_CARD_PROPERTIES } from '~/types/articles'

const message = ref('')

const p = defineProps({
  articleCategory: {
    type: String as PropType<ArticleCategoriesT>,
    required: true
  }
})

const articlesShowcase: Ref<ArticleCardT[]> = ref([])
const category = computed(() => p.articleCategory)
const haveArticles = computed(() => articlesShowcase.value.length > 0)

// Fetch articles on server and client
const { error, status } = await useAsyncData(
  `blog-showcase-${category.value}`,
  async (): Promise<void> => {
    const whereOptions: QueryBuilderParams = {
      // tags: { $in: selectedTags.value },
      status: { $eq: 'published' }
    }

    const articles = (await queryContent('/blog', category.value === 'all' ? '' : category.value)
      .where(whereOptions)
      .only(ARTICLE_CARD_PROPERTIES)
      .sort({ publishedAt: -1 })
      .limit(3)
      .find()) as ArticleCardT[]

    if (articles.length) {
      articlesShowcase.value.push(...articles)
    } else {
      message.value = 'No articles loaded...'
    }
  }
)

if (error.value) {
  console.error('Fetch Articles Error:', error.value)
}
</script>

<template>
  <div>
    <div class="space-y-6 lg:space-y-12">
      <slot name="title" />
      <p
        v-if="message.length"
        class="rounded-md bg-red-950/70 p-4 text-sm lg:text-base"
      >
        {{ message }}
      </p>
      <div
        v-if="haveArticles"
        class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
      >
        <BlogCard
          v-for="article in articlesShowcase"
          :key="`blog-showcase-${article.id}`"
          :article="article"
        />
        <ClientOnly>
          <BlogCardSkeleton v-show="status === 'pending'" />
          <BlogCardSkeleton v-show="status === 'pending'" />
          <BlogCardSkeleton v-show="status === 'pending'" />
        </ClientOnly>
      </div>
      <div class="flex justify-end">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
