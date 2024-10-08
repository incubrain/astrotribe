<script setup lang="ts">
import { ARTICLE_FULL_PROPERTIES } from '~/types/articles'
import type { ArticleFullT } from '~/types/articles'

const route = useRoute()
const title = computed(() => String(route.params.title))
const category = computed(() => String(route.params.category))

// Use `queryContent` directly instead of `useAsyncData`
const article = (await queryContent('/blog', category.value)
  .only(ARTICLE_FULL_PROPERTIES)
  .where({ _path: route.fullPath, status: { $eq: 'published' } })
  .findOne()) as ArticleFullT

if (!article) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

useSeoMeta({
  title: article.title,
  ogTitle: article.title,
  description: article.description,
  ogDescription: article.description,
  ogImage: `images/blog/${article.featured_image}`,
  twitterCard: 'summary_large_image',
  twitterTitle: article.title,
  twitterDescription: article.description,
  twitterImage: `images/blog/${article.featured_image}`,
})

defineOgImageComponent('OgImageDefault', {
  title: article.title,
  description: article.description,
  headline: 'AstronEra',
  image: `images/blog/${article.featured_image}`,
})
</script>

<template>
  <BlogArticle
    v-if="article"
    class="background"
    :article="article"
  />
</template>

<style></style>
