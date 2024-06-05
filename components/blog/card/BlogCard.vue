<script setup lang="ts">
defineProps({
  article: {
    type: Object,
    required: true
  }
})

// !todo: add links to the tags and category
// !todo: add a read time to the article
// !todo: add link to author profile
// consider making read more button more subtle
</script>

<template>
  <PrimeCard
    :pt="{
      root: 'rounded-none md:rounded-md border-b md:border border-color',
      body: 'justify-between h-full'
    }"
  >
    <template #header>
      <BlogCatTag
        :tags="article.tags"
        :category="article.category"
        :article-link="article._path.split('/')[2]"
        class="p-4"
      />
      <BaseImage
        :img="{
          src: `images/blog/${article.category}/${article.featured_image}`,
          width: '400',
          height: '300',
          quality: '80'
        }"
        class="w-full object-cover aspect-video"
      />
    </template>
    <template #title>
      <NuxtLink :to="article._path">
        <h3 class="text-xl lg:text-xl font-bold">
          {{ article.title }}
        </h3>
      </NuxtLink>
    </template>
    <template #subtitle>
      <div class="flex flex-row gap-2 text-sm">
        <p class="text-primary">
          {{ useDateFormat(article.publishedAt, 'DD MMM YYYY').value }}
        </p>
        <BlogAuthor :author-id="article.authorIds[0]">
          <template #default="{ author }">
            <span
              v-if="author"
              class="flex gap-2"
            >
              by
              {{ author.name.given }}
              {{ author.name.surname }}
            </span>
          </template>
        </BlogAuthor>
      </div>
    </template>
    <template #content>
      <div class="flex flex-col gap-2 items-start w-full justify-center">
        <p class="text-sm">
          {{ article.description }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="w-full flex justify-end">
        <NuxtLink :to="article._path">
          <PrimeButton outlined> Read More </PrimeButton>
        </NuxtLink>
      </div>
    </template>
  </PrimeCard>
</template>
