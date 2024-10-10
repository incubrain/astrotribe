<template>
  <div>
    <div class="flex flex-wrap gap-4">
      <!-- <PrimeTag
        :id="`${category.slug}`"
        :value="useChangeCase(category.name, 'capitalCase').value"
        :class="`${badgeColor(category.name)}`"
      />
      <PrimeTag
        v-for="tag in tags"
        :key="`${tag}`"
        :value="tag"
        severity="contrast"
      /> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { ArticleTagsT, ArticleCategoriesT } from '~/types/articles'

// TODO: Add full article as prop and types for article
defineProps({
  tags: {
    type: Array as PropType<ArticleTagsT[]>,
    required: false,
    default: () => [],
  },
  category: {
    type: String as PropType<ArticleCategoriesT>,
    required: false,
    default: 'category missing',
  },
})

const badgeColor = (badge: ArticleCategoriesT | ArticleTagsT): string => {
  switch (badge) {
    case 'people-of-space':
      return 'primary'
    case 'sustainable-development':
      return 'amber'
    case 'space-exploration':
      return 'purple'
    case 'dark-sky-conservation':
      return 'blue'
    default:
      return 'secondary'
  }
}
</script>

<style scoped></style>
