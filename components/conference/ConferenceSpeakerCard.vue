<template>
  <PrimeCard
    class="h-full"
    :pt="{
      body: 'justify-between h-full',
      root: 'overflow-hidden relative'
    }"
    :pt-options="{ mergeProps: true, mergeSections: true }"
  >
    <template #header>
      <div class="absolute left-0 top-0 z-10 hidden h-full w-full bg-black/10 dark:visible" />
      <IBImage
        :img="{
          src: `conference/speakers/${speaker.avatar}.jpg`,
          alt: `${speaker.given_name} will be presenting at the Dark Sky Conservation India Conference`,
          width: '350',
          height: '350',
          loading: 'lazy',
          quality: '80',
          format: 'webp'
        }"
        class="w-full object-cover grayscale-[20%]"
      />
    </template>
    <template #content>
      <div class="flex flex-grow flex-col justify-between gap-4">
        <div class="flex flex-col gap-4 text-sm">
          <h3 class="text-2xl font-semibold">
            {{ speaker.title }} {{ speaker.given_name }} {{ speaker.surname }}
          </h3>
          <p class="flex items-center gap-2 font-semibold text-primary-500 dark:text-primary-600">
            <Icon
              name="mdi:account"
              class="h-4 w-4 flex-shrink-0"
            />
            {{ speaker.professional_title }}
          </p>
          <p class="h-auto text-sm">
            {{ speaker.bio }}
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div
        v-if="speaker.abstract"
        class="border-color flex h-full w-full flex-col justify-end gap-2 rounded-md border p-4"
        :class="featured ? 'bg-white dark:bg-black' : 'bg-primary-100 dark:bg-primary-950'"
        @click="isOpen = true"
      >
        <h5 class="font-semibold">
          Abstract
        </h5>
        <p class="text-sm">
          {{ speaker.abstract.title }}
        </p>
        <PrimeDialog
          v-model:visible="isOpen"
          modal
          :header="speaker.abstract.title"
          :style="{ width: '60rem' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <p>
            {{ speaker.abstract.description }}
          </p>
        </PrimeDialog>
      </div>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

const isOpen = ref(false)

defineProps({
  speaker: {
    type: Object as PropType<SpeakerType>,
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
