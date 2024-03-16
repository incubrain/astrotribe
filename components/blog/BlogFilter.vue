<template>
  <div
    class="space-y-4 h-auto md:border md:border-color md:rounded-md md:p-4 lg:p-8 foreground md:background"
  >
    <div class="flex gap-4 flex-wrap">
      <UButton
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
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES } from '~/types/articles'
import type { ArticleCategoriesT } from '~/types/articles'

const selectedCategory = ref<ArticleCategoriesT>(
  String(useRoute().params.category) as ArticleCategoriesT
)
const upperFirstCategory = (cat: string) => cat.charAt(0).toUpperCase() + cat.slice(1)
</script>
