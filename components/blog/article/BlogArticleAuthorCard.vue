<script setup lang="ts">
defineProps<{
  authorId: number
}>()
</script>
<template>
  <BlogAuthor
    :author-id="authorId"
    class="rounded-xl border border-color p-4 lg:p-8 foreground"
  >
    <template #default="{ author }">
      <div
        v-if="author"
        class="flex flex-row items-center gap-4 lg:gap-8"
      >
        <NuxtImg
          class="rounded-full sm:max-w-[100px] h-full"
          :src="author.avatar"
          :alt="`${author.name.full} is an author on the AstronEra Blog`"
          width="100px"
          height="100px"
        />
        <div class="text-left space-y-1 w-full">
          <h4 class="font-semibold"> About {{ author.name.full }} </h4>
          <p class="text-sm">
            {{ author.bio.full }}
          </p>
        </div>
      </div>
    </template>
  </BlogAuthor>
</template>

<style scoped></style>
