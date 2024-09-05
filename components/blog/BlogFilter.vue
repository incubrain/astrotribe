<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { CATEGORIES } from '~/types/articles'
import type { ArticleCategoriesT } from '~/types/articles'

const selectedCategory = ref<ArticleCategoriesT>(
  String(useRoute().params.category) as ArticleCategoriesT,
)
const formatCategory = (cat: string) => useChangeCase(cat, 'capitalCase').value

// !todo: low priority - add a search bar to filter articles
// !todo: low priority - color code the categories
// !todo: important - finalize the categories
// !todo: medium priority - refine the floating ad copy & add join hub CTA
// consider having categories types in this file and exporting to where needed
</script>

<template>
  <div class="h-auto space-y-4 md:rounded-md">
    <div class="flex flex-wrap items-center gap-4">
      <h3 class="flex h-full items-center text-xl font-semibold leading-none">
        Categories:
      </h3>
      <NuxtLink
        v-for="cat in CATEGORIES"
        :key="`astronera-blog-${cat}`"
        :to="`/blog/${cat}`"
      >
        <PrimeButton
          color="primary"
          :aria-label="`${formatCategory(cat)} articles`"
          :outlined="selectedCategory === cat ? false : true"
          :label="formatCategory(cat)"
          size="small"
          class="cursor-pointer"
        />
      </NuxtLink>
    </div>
  </div>
</template>
