<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

defineProps({
  article: {
    type: Object,
    required: true,
  },
})

// !todo: add links to the tags and category
// !todo: add a read time to the article
// !todo: add link to author profile
// consider making read more button more subtle
</script>

<template>
  <PrimeCard>
    <template #header>
      <BlogCatTag
        :tags="article.tags"
        :category="article.category"
        :article-link="article._path.split('/')[2]"
        class="p-4"
      />
      <IBImage
        :img="{
          src: `images/blog/${article.category}/${article.featured_image}`,
          width: '400',
          height: '300',
          quality: '80',
        }"
        class="aspect-video w-full object-cover"
      />
    </template>
    <template #title>
      <NuxtLink :to="article._path">
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
        <BlogAuthor :author-ids="article.authorIds">
          <template #default="{ authors }">
            <span
              v-if="authors"
              class="flex gap-2"
            >
              by
              <span
                v-for="(author, i) in authors"
                :key="`author-${i}`"
              >
                {{ author?.name.given }}
                {{ author?.name.surname }}
              </span>
            </span>
          </template>
        </BlogAuthor>
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
        <NuxtLink :to="article._path">
          <PrimeButton outlined> Read More </PrimeButton>
        </NuxtLink>
      </div>
    </template>
  </PrimeCard>
</template>
