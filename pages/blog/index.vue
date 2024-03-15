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
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>
