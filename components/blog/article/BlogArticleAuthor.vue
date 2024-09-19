<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

defineProps<{
  authorIds: number[]
  publishedAt: string
}>()
</script>

<template>
  <BlogAuthor :author-ids="authorIds">
    <template #default="{ authors }">
      <div
        v-if="authors && authors.length > 0"
        class="flex flex-col items-center"
      >
        <div class="flex items-center">
          <template
            v-for="(author, index) in authors"
            :key="author?.id"
          >
            <div
              v-if="index > 0"
              class="text-lg mx-2 font-bold"
            >
              &
            </div>
            <div class="flex flex-col items-center">
              <IbImage
                v-if="author"
                :img="{
                  src: author.avatar,
                  alt: `${author.name.given} ${author.name.surname} is an author on the AstronEra Blog`,
                  width: '44px',
                  height: '44px',
                }"
                class="border-color rounded-full border"
              />
              <p
                v-if="author"
                class="mt-2 text-center text-sm font-semibold"
              >
                {{ author.name.given }}<br />{{ author.name.surname }}
              </p>
            </div>
          </template>
        </div>
        <p class="mt-4 text-sm">
          Published: {{ useDateFormat(publishedAt, 'DD MMM YYYY').value }}
        </p>
      </div>
    </template>
  </BlogAuthor>
</template>

<style scoped>
.border-color {
  border-color: var(--border-color, #e2e8f0);
}
</style>
