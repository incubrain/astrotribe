<script setup lang="ts">
import { CATEGORIES } from '~/types/articles'
import type { ArticleCategoriesT } from '~/types/articles'

const selectedCategory = ref<ArticleCategoriesT>(
  String(useRoute().params.category) as ArticleCategoriesT
)
const upperFirstCategory = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1)

// !todo: low priority - add a search bar to filter articles
// !todo: low priority - color code the categories
// !todo: important - finalize the categories
// !todo: medium priority - refine the floating ad copy & add join hub CTA
// consider having categories types in this file and exporting to where needed
</script>

<template>
  <PrimeCard class="space-y-4 h-auto md:rounded-md">
    <template #content>
      <div class="flex gap-4 flex-wrap">
        <PrimeButton
          v-for="cat in CATEGORIES"
          :key="`astronera-blog-${cat}`"
          color="primary"
          :aria-label="`${cat} articles`"
          :variant="selectedCategory === cat ? 'solid' : 'outline'"
          :to="`/blog/${cat}`"
          :label="upperFirstCategory(cat)"
          size="sm"
          class="cursor-pointer"
        />
      </div>
    </template>
  </PrimeCard>
</template>
