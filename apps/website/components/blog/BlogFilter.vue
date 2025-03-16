<script setup lang="ts">
import { useChangeCase } from '@vueuse/integrations/useChangeCase'
import { CATEGORIES } from '~/types/articles'
import type { ArticleCategoriesT } from '~/types/articles'

const selectedCategory = ref<ArticleCategoriesT>(
  String(useRoute().params.category) as ArticleCategoriesT,
)
const formatCategory = (cat: string) => useChangeCase(cat, 'capitalCase').value

</script>

<template>
  <div>
    <NuxtLink
      v-for="cat in CATEGORIES"
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
