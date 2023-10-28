<template>
  <div>
    <UCard
      :ui="{
        base: 'flex flex-col h-full',
        background: featured ? 'bg-primary-50 dark:bg-primary-950' : 'background',
        header: { padding: '', base: 'relative' },
        body: { base: 'flex flex-grow h-full', padding: 'sm:px-4' },
        footer: { base: 'flex flex-shrink', padding: 'sm:px-4' },
        ring: 'ring-1 ring-gray-200 dark:ring-gray-800'
      }"
      class="h-full"
    >
      <template #header>
        <div class="invisible dark:visible absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
        <NuxtImg
          :src="`conference/speakers/${speaker.avatar}.jpg`"
          :alt="`${speaker.given_name} will be presenting at the Dark Sky Conservation India Conference`"
          width="350"
          height="350"
          loading="lazy"
          quality="80"
          format="webp"
          class="object-cover w-full grayscale-[20%]"
        />
      </template>
      <div class="flex flex-col gap-4 justify-between flex-grow">
        <div class="text-sm flex flex-col gap-4">
          <h3 class="text-2xl font-semibold">
            {{ speaker.title }} {{ speaker.given_name }} {{ speaker.surname }}
          </h3>
          <p class="flex gap-2 items-center text-primary-500 dark:text-primary-600 font-semibold">
            <UIcon
              name="i-mdi-account"
              class="w-4 h-4 flex-shrink-0"
            />
            {{ speaker.professional_title }}
          </p>
          <p class="h-auto text-sm">
            {{ speaker.bio }}
          </p>
        </div>
      </div>
      <template #footer>
        <div
          class="flex flex-col gap-2 p-4 justify-center w-full rounded-md border border-color"
          :class="featured ? 'bg-white dark:bg-black' : 'bg-primary-50 dark:bg-primary-950'"
        >
          <h5 class="font-semibold"> Abstract </h5>
          <p class="text-sm">
            {{ speaker.abstract }}
          </p>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { Speaker } from '~/types/conference'

defineProps({
  speaker: {
    type: Object as PropType<Speaker>,
    required: true
  },
  featured: {
    type: Boolean,
    required: false,
    default: false
  }
})
</script>

<style scoped></style>
