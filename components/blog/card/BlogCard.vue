<template>
  <div
    class="relative w-full h-full md:rounded-md border border-color p-4 gap-2 flex flex-col overflow-hidden background"
  >
    <BlogCatTag
      :tags="article.tags"
      :category="article.category"
      :article-link="article._path.split('/')[2]"
      class="pb-2 pl-2"
    />
    <NuxtImg
      class="rounded-md w-full object-cover aspect-video border border-color"
      :src="`images/blog/${article.category}/${article.featured_image}`"
      width="400"
      height="300"
      quality="80"
    />
    <div class="flex flex-col gap-2 items-start w-full px-2 pt-2 justify-center">
      <NuxtLink :to="article._path">
        <h3 class="text-xl lg:text-xl font-bold">
          {{ article.title }}
        </h3>
      </NuxtLink>

      <div class="flex flex-row gap-2 justify-center items-center text-sm">
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
      <p class="text-sm">
        {{ article.description }}
      </p>
    </div>
    <div class="w-full flex justify-end h-full items-end pt-2">
      <UButton
        :to="article._path"
        color="white"
        variant="solid"
      >
        Read More
      </UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  article: {
    type: Object,
    required: true
  }
})
</script>
