<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const p = defineProps<{
  authors: any[]
  publishedAt: string
}>()

console.log('Props:', p)
</script>

<template>
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
          <IBImage
            v-if="author"
            :img="{
              src: `images/team/${author.name.toLowerCase().replace(' ', '-')}.jpg`,
              alt: `${author.name} is an author on the AstronEra Blog`,
              width: '44px',
              height: '44px',
            }"
            class="border-color rounded-full border"
          />
          <p
            v-if="author"
            class="mt-2 text-center text-sm font-semibold"
          >
            {{ author.name }}<br />
          </p>
        </div>
      </template>
    </div>
    <p class="mt-4 text-sm"> Published: {{ useDateFormat(publishedAt, 'DD MMM YYYY').value }} </p>
  </div>
</template>

<style scoped></style>
