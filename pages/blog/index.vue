<script setup lang="ts">
import { newsListGovernment } from '@/types/news'
</script>

<template>
  <div class="space-y-10 wrapper padded-y padded-x">
    <h1>Blog Home</h1>
    <BlogShowcase article-category="isro">
      <template #title>
        <CommonTitle
          :title="{
            main: 'Latest ISRO News',
            subtitle:
              'Keep up to date with the latest news out of the Indian Space Research Organisation.'
          }"
        />
      </template>
      <UButton to="/blog/isro">All ISRO Articles</UButton>
    </BlogShowcase>
    <BlogNews
      v-for="newsCat in newsListGovernment"
      :key="`news-showcase-${newsCat}`"
      :news-category="newsCat"
    />
  </div>
</template>

<style scoped></style>
