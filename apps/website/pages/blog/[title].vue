<script setup lang="ts">
import { computed } from 'vue'

// interface ArticleFullT {
//   id: number
//   title: string
//   description: string
//   slug: string
//   createdAt: string
//   updatedAt: string
//   publishedAt: string
//   blocks: Array<{
//     __component: string
//     body: string
//     id: number
//   }>
//   author: {
//     id: number
//     documentId: string
//   }
//   category: {
//     id: number
//     documentId: string
//   }
//   cover: {
//     id: number
//     documentId: string
//   }
// }

const route = useRoute()
const { findOne } = useStrapi()

const slug = computed(() => String(route.params.title))

console.log('Slug:', slug.value)
console.log('Route params:', route.params)

const { data, pending, error } = await useAsyncData(
  `article-${slug.value}`,
  async () => {
    try {
      const article = await findOne('articles', {
        filters: { slug: { $eq: slug.value } },
        populate: {
          cover: true,
          blocks: true,
          category: true,
          tags: { fields: ['id', 'name'] },
          author: { populate: ['avatar'] },
        },
      })

      if (!article) {
        throw createError({ statusCode: 404, message: 'Article not found' })
      }

      // Fetch author details if needed
      if (article.data && !!article.data.attributes?.author) {
        const authorDetails = await findOne('authors', article.data.attributes.author.data.id, {
          populate: ['avatar', 'social_links'],
        })
        article.data.attributes.author = authorDetails.data
      }

      return article
    } catch (e) {
      console.error('Error fetching article:', e)
      throw createError({ statusCode: 404, message: 'Article not found' })
    }
  },
  { server: false }, // Set to true if you want server-side rendering
)

const article = computed(() => {
  if (data.value && Array.isArray(data.value.data) && data.value.data.length > 0) {
    return data.value.data[0]
  }
  return null
})

console.log('Raw data:', data.value)
console.log('Article:', article.value)
</script>

<template>
  <div>
    <div v-if="pending">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <BlogArticle
      v-else-if="article"
      class="background"
      :article="article"
    />
    <div v-else>No article found</div>
  </div>
</template>

<style></style>
