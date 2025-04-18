<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue'
import type { PropType } from 'vue'
import type { ArticleCategoryT } from '#shared/constants'

const message = ref('')

const props = defineProps({
  articleCategory: { type: String as PropType<ArticleCategoryT>, required: true },
})

const articlesShowcase = ref([])
const category = computed(() => props.articleCategory)
const haveArticles = computed(() => articlesShowcase.value.length > 0)
const cmsURL = String(useRuntimeConfig().public.cmsURL ?? 'http://localhost:1337')

// Fetch articles on server and client
const { data, error, status } = await useAsyncData(`blog-showcase-${category.value}`, async () => {
  const params: any = {
    pagination: { pageSize: 3, page: 1 },
    sort: ['publishedAt:desc'],
    filters: {},
    populate: {
      cover: { populate: '*' },
      category: { fields: ['name', 'slug'] },
      author: { fields: ['name', 'bio'] },
    },
  }

  if (category.value !== 'all') {
    params.filters['category'] = { slug: { $eq: category.value } }
  }
})

if (error.value) {
  console.error('Fetch Articles Error:', error.value)
}

watchEffect(() => {
  if (data.value) {
    articlesShowcase.value = data.value
  }
})
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
        <BlogCardClass
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
