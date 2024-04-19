<template>
  <div>
    <div class="flex flex-wrap gap-4">
      <PrimeTag
        :id="`${articleLink}-${category}`"
        :value="category"
        :class="`${badgeColor(category)}`"
      />
      <PrimeTag
        v-for="tag in tags"
        :key="`${articleLink}-${tag}`"
        :value="tag"
        severity="secondary"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ArticleTagsT, ArticleCategoriesT } from '~/types/articles'

// TODO: Add full article as prop and types for article
defineProps({
  articleLink: {
    type: String,
    required: true
  },
  tags: {
    type: Array as PropType<ArticleTagsT[]>,
    required: false,
    default: () => []
  },
  category: {
    type: String as PropType<ArticleCategoriesT>,
    required: false,
    default: 'category missing'
  }
})

const badgeColor = (badge: ArticleCategoriesT | ArticleTagsT): string => {
  switch (badge) {
    case 'isro':
      return 'primary'
    case 'spacex':
      return 'amber'
    case 'nasa':
      return 'purple'
    case 'esa':
      return 'blue'
    case 'ula':
      return 'green'
    default:
      return 'gray'
  }
}
</script>

<style scoped></style>
