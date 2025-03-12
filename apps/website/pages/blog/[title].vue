<script setup lang="ts">
import { computed } from 'vue'

const route = useRoute()

const cmsURL = String(useRuntimeConfig().public.cmsURL ?? 'http://localhost:1337')
const strapi = useStrapi(cmsURL)

const slug = computed(() => String(route.params.title))

const { data, status, error } = await useAsyncData(
  `article-${slug.value}`,
  async () => {
    try {
      const params: any = {
        filters: { slug: { $eq: slug.value } },
        populate: {
          cover: { populate: true },
          category: { populate: true },
          blocks: true,
          author: { fields: ['name', 'bio'], populate: { avatar: { populate: true } } },
        },
      }

      const response = await strapi.find<any>('articles', params)

      if (!response || !response.data || response.data.length === 0) {
        console.error({ statusCode: 404, message: 'Article not found' })
        throw new Error('Article not found')
      }

      const article = response.data[0]

      return article
    } catch (e) {
      console.error('Error fetching article in function:', e)
      throw e
    }
  },
  { server: false },
)

if (error.value) {
  console.error('Error fetching article outside function:', error)
  throw error
}

const isLoading = computed(() => status.value === 'pending')

const article = computed(() => data.value)
</script>

<template>
  <div>
    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">{{ error.message }}</div>
    <BlogArticle
      v-else-if="article"
      class="background"
      :article="article"
    />
    <div v-else>No article found</div>
  </div>
</template>
