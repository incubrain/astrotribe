<template>
  <PrimeCard
    class="h-full"
    :pt="{
      body: 'justify-between h-full',
      root: 'overflow-hidden relative'
    }"
  >
    <template #header>
      <div class="hidden dark:visible absolute top-0 left-0 w-full h-full bg-black/10 z-10" />
      <BaseImage
        :img="{
          src: `conference/speakers/${speaker.avatar}.jpg`,
          alt: `${speaker.given_name} will be presenting at the Dark Sky Conservation India Conference`,
          width: '350',
          height: '350',
          loading: 'lazy',
          quality: '80',
          format: 'webp'
        }"
        class="object-cover w-full grayscale-[20%]"
      />
    </template>
    <template #content>
      <div class="flex flex-col gap-4 justify-between flex-grow">
        <div class="text-sm flex flex-col gap-4">
          <h3 class="text-2xl font-semibold">
            {{ speaker.title }} {{ speaker.given_name }} {{ speaker.surname }}
          </h3>
          <p class="flex gap-2 items-center text-primary-500 dark:text-primary-600 font-semibold">
            <Icon
              name="mdi:account"
              class="w-4 h-4 flex-shrink-0"
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
        class="flex flex-col gap-2 p-4 justify-end w-full h-full rounded-md border border-color"
        :class="featured ? 'bg-white dark:bg-black' : 'bg-primary-50 dark:bg-primary-950'"
        @click="isOpen = true"
      >
        <h5 class="font-semibold"> Abstract </h5>
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
