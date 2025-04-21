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

// Get a formatted date from the article
const formattedDate = computed(() => {
  const dateStr = props.article.createdAt || props.article.publishedAt
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
</script>

<template>
  <BlogGlass
    gradient="blue"
    intensity="low"
    interactive
    glow-color="primary"
  >
    <div class="h-full flex flex-col">
      <div class="h-48 w-full overflow-hidden rounded-t-xl relative z-0">
        <BlogMedia
          v-if="article.image"
          :url="`${article.image}.png`"
          :alt="article.image || article.title"
          :width="400"
          :height="250"
          class="h-full w-full object-contain"
        />
        <div
          v-else
          class="h-full w-full bg-primary-950"
        />
        <div class="absolute bottom-0 left-0 w-full p-2">
          <BlogCatTag
            v-if="displayTags.length > 0 || categoryData"
            :tags="displayTags"
            :category="categoryData"
          />
        </div>
      </div>

      <div class="relative flex flex-col gap-4 p-4 flex-auto z-20">
        <NuxtLink :to="getArticleUrl(article)">
          <h3 class="text-xl font-bold hover:text-primary-400 transition">
            {{ article.title }}
          </h3>
        </NuxtLink>

        <!-- Metadata -->
        <div class="flex flex-row justify-between items-center text-sm text-gray-400">
          <div class="flex items-center gap-1">
            <Icon
              name="i-lucide-calendar"
              class="w-4 h-4"
            />
            <span>{{ formattedDate }}</span>
          </div>
          <div class="flex items-center gap-1">
            <Icon
              name="i-lucide-clock"
              class="w-4 h-4"
            />
            <span>{{ readingTime }}</span>
          </div>
        </div>

        <!-- Author -->
        <div class="flex flex-col gap-2">
          <div
            v-if="authorData"
            class="flex items-center gap-2 p-4"
          >
            <IBImage
              v-if="authorData.avatar?.url"
              :img="{
                src: authorData.avatar.url,
                alt: `${authorData.name} avatar`,
                width: '32',
                height: '32',
              }"
              class="rounded-full border border-primary-800"
            />
            <span class="text-sm">{{ authorData.name }}</span>
          </div>
          <p class="text-sm text-gray-300 line-clamp-3">
            {{ article.description }}
          </p>
        </div>

        <!-- Read more button -->
        <div class="mt-auto pt-2">
          <NuxtLink
            :to="getArticleUrl(article)"
            target="_blank"
          >
            <PrimeButton
              outlined
              size="small"
              class="w-full"
            >
              Read More
            </PrimeButton>
          </NuxtLink>
        </div>
      </div>
    </div>
  </BlogGlass>
</template>
