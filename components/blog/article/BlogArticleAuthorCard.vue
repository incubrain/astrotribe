<script setup lang="ts">
defineProps<{
  authorId: number
}>()
</script>
<template>
  <BlogAuthor
    :author-id="authorId"
    class="border-color foreground rounded-xl border p-4 xl:p-8"
  >
    <template #default="{ author }">
      <div
        v-if="author"
        class="flex flex-row items-center gap-4 xl:gap-8"
      >
        <BaseImage
          :img="{
            src: author.avatar,
            alt: `${author.name.full} is an author on the AstronEra Blog`,
            width: '100px',
            height: '100px'
          }"
          class="h-full rounded-full sm:max-w-[100px]"
        />
        <div class="w-full space-y-1 text-left">
          <div class="flex gap-2 items-center">
            <h4 class="text-xl font-semibold"> About {{ author.name.full }} </h4>
            <PrimeTag class="text-primary-600 text-xs uppercase">follow</PrimeTag>
            <BaseSocialBlock
              v-if="author.socials"
              :socials="author.socials"
            />
          </div>
          <p class="text-sm">
            {{ author.bio.full }}
          </p>
        </div>
      </div>
    </template>
  </BlogAuthor>
</template>

<style scoped></style>
