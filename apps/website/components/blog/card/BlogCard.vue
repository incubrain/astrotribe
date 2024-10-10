<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

defineProps({
  article: {
    type: Object,
    required: true,
  },
})

const baseUrl = process.env.STRAPI_PUBLIC_URL
</script>

<template>
  <PrimeCard v-if="article">
    <template #header>
      <BlogCatTag
        v-if="article.tags"
        :tags="article.tags"
        :category="article.category"
        class="p-4"
      />
      <IBImage
        :img="{
          src: `${baseUrl}${article.cover.url}`,
          width: '400',
          height: '300',
          quality: '80',
        }"
        class="aspect-video w-full object-cover"
      />
    </template>
    <template #title>
      <NuxtLink :to="`/blog/${article.slug}`">
        <h3 class="text-xl font-bold lg:text-xl">
          {{ article.title }}
        </h3>
      </NuxtLink>
    </template>
    <template #subtitle>
      <div class="flex flex-row gap-2 text-sm">
        <p class="text-primary">
          {{ useDateFormat(article.publishedAt, 'DD MMM YYYY').value }}
        </p>
        <!-- <span
          v-if="article.author"
          class="flex gap-2"
        >
          by
          <span
            v-for="author in article.author"
            :key="author.id"
          >
            {{ author.name }}
          </span>
        </span> -->
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col items-start justify-center gap-2">
        <p class="text-sm">
          {{ article.description }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end">
        <NuxtLink :to="`/blog/${article.slug}`">
          <PrimeButton outlined> Read More </PrimeButton>
        </NuxtLink>
      </div>
    </template>
  </PrimeCard>
</template>
