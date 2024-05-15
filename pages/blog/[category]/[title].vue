<template>
  <BlogArticle
    v-if="article?.body"
    class="background"
    :article="article"
  />
</template>

<script setup lang="ts">
import { ARTICLE_FULL_PROPERTIES } from '~/types/articles'
import type { ArticleFullT } from '~/types/articles'

const route = useRoute()
const title = computed(() => String(route.params.title))
const category = computed(() => String(route.params.category))

const { error, data: article } = await useAsyncData(
  `article-${title.value}`,
  () =>
    queryContent('/blog', category.value)
      .only(ARTICLE_FULL_PROPERTIES)
      .where({ _path: route.fullPath, status: { $eq: 'published' } })
      .findOne() as Promise<ArticleFullT>
)

if (error.value) {
  console.error(error.value)
}

if (article.value) {
  useSeoMeta({
    title: article.value.title,
    ogTitle: article.value.title,
    description: article.value.description,
    ogDescription: article.value.description,
    ogImage: `images/blog/${article.value.featured_image}`,
    twitterCard: 'summary_large_image',
    twitterTitle: article.value.title,
    twitterDescription: article.value.description,
    twitterImage: `images/blog/${article.value.featured_image}`
  })

  defineOgImageComponent('OgImageDefault', {
    title: article.value.title,
    description: article.value.description,
    headline: 'AstronEra',
    image: `images/blog/${article.value.featured_image}`
  })
}
</script>

<style></style>
