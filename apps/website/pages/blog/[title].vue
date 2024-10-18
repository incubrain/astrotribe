<script setup lang="ts">
import qs from 'qs'
import { computed } from 'vue'
import { useRoute } from '#imports'

const route = useRoute()
const strapi = useStrapi()

const slug = computed(() => String(route.params.title))

const { data, pending, error } = await useAsyncData(
  `article-${slug.value}`,
  async () => {
    try {
      const params: any = {
        filters: {
          slug: {
            $eq: slug.value,
          },
        },
        populate: {
          cover: {
            populate: '*',
          },
          category: {
            fields: ['name', 'slug'],
          },
          tags: {
            fields: ['id', 'name'],
          },
          author: {
            populate: {
              avatar: {
                populate: '*',
              },
            },
            fields: ['name', 'bio'],
          },
        },
      }

      const response = await strapi.fetchFromStrapi<any>('articles', params)

      if (!response || !response.data || response.data.length === 0) {
        console.error({ statusCode: 404, message: 'Article not found' })
      }

      const article = response.data[0]

      return article
    } catch (e) {
      console.error('Error fetching article:', e)
    }
  },
  { server: true },
)

const article = computed(() => data.value)

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
