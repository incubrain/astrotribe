<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import type { PropType } from 'vue'

// Define types based on Content collection schema
type ArticleTagT = {
  name: string
}

type ArticleCategoryT = {
  name: string
  slug: string
}

defineProps({
  tags: {
    type: Array as PropType<ArticleTagT[]>,
    required: false,
    default: () => [],
  },
  category: {
    type: Object as PropType<ArticleCategoryT>,
    required: false,
    default: null,
  },
})

const badgeColor = (categorySlug: string): string => {
  switch (categorySlug) {
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

<template>
  <div>
    <div class="flex flex-wrap gap-4">
      <PrimeTag
        v-if="category && category.name"
        :value="useChangeCase(category.name, 'capitalCase').value"
        :class="badgeColor(category.slug)"
      />
      <PrimeTag
        v-for="tag in tags"
        :key="tag.name"
        :value="tag.name"
        severity="contrast"
      />
    </div>
  </div>
</template>

<style scoped></style>
