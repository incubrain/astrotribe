<script setup lang="ts">
defineProps<{
  authorId: number
  publishedAt: string
}>()
</script>

<template>
  <BlogAuthor :author-id="authorId">
    <template #default="{ author }">
      <div
        v-if="author"
        class="flex items-start gap-2 rounded-md"
      >
        <BaseImage
          :img="{
            src: author.avatar,
            alt: `${author.name.given} ${author.name.surname} is an author on the AstronEra Blog`,
            width: '44px',
            height: '44px'
          }"
          class="border border-color rounded-full"
        />
        <div class="flex flex-col">
          <p class="font-semibold text-nowrap"> {{ author.name.given }} {{ author.name.surname }} </p>
          <div>
            <p class="text-sm"> Published: {{ useDateFormat(publishedAt, 'DD MMM YYYY').value }} </p>
          </div>
        </div>
      </div>
    </template>
  </BlogAuthor>
</template>
<style scoped></style>
