<script setup lang="ts">
import { computed } from 'vue'

interface ArticleFullT {
  id: number
  title: string
  description: string
  slug: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  blocks: Array<{
    __component: string
    body: string
    id: number
  }>
  author: {
    id: number
    documentId: string
  }
  category: {
    id: number
    documentId: string
  }
  cover: {
    id: number
    documentId: string
  }
}

const ARTICLE_FULL_PROPERTIES = [
  'id',
  'title',
  'description',
  'content',
  'slug',
  'category',
  'status',
  'createdAt',
  'updatedAt',
  'publishedAt',
  'featured_image',
]

const route = useRoute()
const { findOne } = useStrapi()

const title = computed(() => String(route.params.title))
const category = computed(() => String(route.params.category))

// Fetch single article from Strapi
const { data, pending, error } = await useAsyncData('article', async () => {
  const article = await findOne('articles', {
    filters: {
      slug: title.value,
    },
    populate: {
      cover: true,
      blocks: true,
      category: true,
      tags: {
        fields: ['id', 'name'], // adjust based on your tag fields
      },
      author: {
        populate: ['avatar'], // Assuming the author has an avatar field
      },
    },
  })

  // If we have an article and an author, fetch the full author details
  if (article && article.author) {
    const authorDetails = await findOne('authors', article.author.id, {
      populate: ['avatar', 'social_links'], // Adjust based on your author model
    })

    // Merge the fetched author details with the article
    return {
      ...article,
      author: authorDetails,
    }
  }

  return article
})

// Handle errors
if (error.value) {
  throw createError({ statusCode: 404, message: 'Article not found' })
}

const article = computed(() => {
  if (data.value && data.value.data) {
    console.log('haveUser', data.value.data[0])
    return data.value.data[0]
  }
  return null
})

console.log('article', article)

// Wait for the data to be available before accessing it
// need to make this work with strapi
// watch(article, (newArticle) => {
//   if (newArticle && newArticle.length > 0) {
//     const currentArticle = newArticle[0]

//     useSeoMeta({
//       title: currentArticle.attributes.title,
//       ogTitle: currentArticle.attributes.title,
//       description: currentArticle.attributes.description,
//       ogDescription: currentArticle.attributes.description,
//       ogImage: useStrapiMedia(currentArticle.attributes.featured_image.data.attributes.url),
//       twitterCard: 'summary_large_image',
//       twitterTitle: currentArticle.attributes.title,
//       twitterDescription: currentArticle.attributes.description,
//       twitterImage: useStrapiMedia(currentArticle.attributes.featured_image.data.attributes.url),
//     })

//     defineOgImageComponent('OgImageDefault', {
//       title: currentArticle.attributes.title,
//       description: currentArticle.attributes.description,
//       headline: 'AstronEra',
//       image: useStrapiMedia(currentArticle.attributes.featured_image.data.attributes.url),
//     })
//   }
// })
</script>

<template>
  <div v-if="pending">Loading...</div>
  <div v-else-if="error">Error: {{ error }}</div>
  <BlogArticle
    v-else-if="article"
    class="background"
    :article="article"
  />
  <div v-else>No article found</div>
</template>

<style></style>
