<script setup lang="ts">
import { CATEGORIES } from '~/types/articles'
import type { ArticleCategoriesT } from '~/types/articles'
import { useChangeCase } from '@vueuse/integrations/useChangeCase'

const selectedCategory = ref<ArticleCategoriesT>(
  String(useRoute().params.category) as ArticleCategoriesT
)
const formatCategory = (cat: string) => useChangeCase(cat, 'capitalCase').value

// !todo: low priority - add a search bar to filter articles
// !todo: low priority - color code the categories
// !todo: important - finalize the categories
// !todo: medium priority - refine the floating ad copy & add join hub CTA
// consider having categories types in this file and exporting to where needed
</script>

<template>
  <div class="space-y-4 h-auto md:rounded-md">
    <div class="flex gap-4 flex-wrap items-center">
      <h3 class="text-xl font-semibold h-full flex items-center leading-none"> Categories: </h3>
      <PrimeButton
        v-for="cat in CATEGORIES"
        :key="`astronera-blog-${cat}`"
        color="primary"
        :aria-label="`${formatCategory(cat)} articles`"
        :variant="selectedCategory === cat ? 'solid' : 'outline'"
        :to="`/blog/${cat}`"
        :label="formatCategory(cat)"
        size="small"
        class="cursor-pointer"
      />
    </div>
  </div>
</template>
