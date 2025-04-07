<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { BLOG_CATEGORIES, type ArticleCategoryT } from '#shared/constants'

const selectedCategory = ref<ArticleCategoryT>(
  String(useRoute().params.category) as ArticleCategoryT,
)
const formatCategory = (cat: string) => useChangeCase(cat, 'capitalCase').value
</script>

<template>
  <div class="flex gap-2">
    <NuxtLink
      v-for="cat in BLOG_CATEGORIES"
      :key="`astronera-blog-${cat}`"
      :to="`/blog/category/${cat}`"
    >
      <PrimeButton
        color="primary"
        :outlined="selectedCategory === cat ? false : true"
        :label="formatCategory(cat)"
        size="small"
        class="cursor-pointer"
      />
    </NuxtLink>
  </div>
</template>
