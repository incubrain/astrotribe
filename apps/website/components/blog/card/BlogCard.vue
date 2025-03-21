<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'
import { useBlogHelpers } from '~/composables/useBlogHelpers'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const { getArticleUrl } = useBlogHelpers()

// Fetch author data if needed
const { data: authorData } = await useAsyncData(`author-${props.article.id}`, async () => {
  if (!props.article.author) return null

  // If author is already a full object, use it directly
  if (typeof props.article.author === 'object' && props.article.author.name) {
    return props.article.author
  }

  // Otherwise fetch the author by ID/slug
  return queryCollection('authors').where('stem', '=', props.article.author).first()
})

// Fetch category data if needed
const { data: categoryData } = await useAsyncData(`category-${props.article.id}`, async () => {
  if (!props.article.category) return null

  // If category is already a full object, use it directly
  if (typeof props.article.category === 'object' && props.article.category.name) {
    return props.article.category
  }

  // Otherwise fetch the category by ID/slug
  return queryCollection('categories').where('stem', '=', props.article.category).first()
})

// Get a formatted date from the article
const formattedDate = computed(() => {
  const dateStr = props.article.date || props.article.publishedAt
  return dateStr ? useDateFormat(dateStr, 'DD MMM YYYY').value : ''
})

// Calculate reading time
const readingTime = computed(() => {
  if (!props.article.body?.children) return '1 min read'

  // Extract text content from the article body
  const text = JSON.stringify(props.article.body)

  // Average reading speed: 200 words per minute
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / 200)

  return `${minutes} min read`
})

// Helper to get tags in the correct format
const displayTags = computed(() => {
  const tags = props.article.tags
  if (!tags) return []

  // If tags are already strings in an array, use them directly
  if (Array.isArray(tags) && typeof tags[0] === 'string') {
    return tags
  }

  // If tags are objects with a name property, extract the names
  if (Array.isArray(tags) && typeof tags[0] === 'object') {
    return tags.map((tag) => tag.name)
  }

  return []
})
</script>

<template>
  <PrimeCard v-if="article">
    <!-- Card header with image -->
    <template #header>
      <BlogCatTag
        v-if="displayTags.length > 0 || categoryData"
        :tags="displayTags"
        :category="categoryData"
        class="p-4"
      />
      <BlogMedia
        v-if="article.cover?.url"
        :url="article.cover.url"
        :alt="article.cover.alternativeText || article.title"
        :width="400"
        :height="300"
        class="aspect-video w-full object-cover"
      />
      <div
        v-else
        class="aspect-video w-full bg-gray-200"
      />
    </template>

    <!-- Card title with link -->
    <template #title>
      <NuxtLink :to="getArticleUrl(article)">
        <h3 class="text-xl font-bold lg:text-xl">
          {{ article.title }}
        </h3>
      </NuxtLink>
    </template>

    <!-- Card metadata -->
    <template #subtitle>
      <div class="flex flex-row gap-2 text-sm justify-between">
        <p class="text-primary">
          {{ formattedDate }}
        </p>
        <div class="flex items-center gap-1">
          <Icon
            name="i-lucide-clock"
            class="w-4 h-4"
          />
          <span>{{ readingTime }}</span>
        </div>
      </div>
      <div
        v-if="authorData"
        class="text-sm text-gray-500 mt-1"
      >
        By {{ authorData.name }}
      </div>
    </template>

    <!-- Card content -->
    <template #content>
      <div class="flex w-full flex-col items-start justify-center gap-2">
        <p class="text-sm">
          {{ article.description }}
        </p>
      </div>
    </template>

    <!-- Card footer -->
    <template #footer>
      <div class="flex w-full justify-end">
        <NuxtLink :to="getArticleUrl(article)">
          <PrimeButton outlined> Read More </PrimeButton>
        </NuxtLink>
      </div>
    </template>
  </PrimeCard>
</template>
