<script setup lang="ts">
import { useDateFormat } from '@vueuse/core'

const p = defineProps({
  project: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <PrimeCard v-if="project">
    <template #header>
      <NuxtImg
        :src="project.image.src"
        width="400"
        height="300"
        quality="80"
        class="aspect-video w-full object-cover"
      />
    </template>
    <template #title>
      <NuxtLink :to="project.slug">
        <h3 class="text-xl font-bold lg:text-xl">
          {{ project.title }}
        </h3>
      </NuxtLink>
    </template>
    <template #subtitle>
      <div class="flex flex-row gap-2 text-sm">
        <p class="text-primary">
          {{ project.date }}
        </p>
      </div>
    </template>
    <template #content>
      <div class="flex w-full flex-col items-start justify-center gap-2">
        <p class="text-sm">
          {{ project.description }}
        </p>
      </div>
    </template>
    <template #footer>
      <div class="flex w-full justify-end">
        <NuxtLink :to="project.slug">
          <PrimeButton outlined> Read More </PrimeButton>
        </NuxtLink>
      </div>
    </template>
  </PrimeCard>
</template>

<style scoped></style>
