<script setup lang="ts">
import type { SpeakerType } from '@/types/conference'

const isOpen = ref(false)

defineProps({
  speaker: {
    type: Object as PropType<SpeakerType>,
    required: true,
  },
  featured: {
    type: Boolean,
    required: false,
    default: false,
  },
})
</script>

<template>
  <LandingGlass
    hover-effect="glow"
    glow-color="purple"
    gradient="mixed"
    intensity="low"
    interactive
    isolate-content
    :padded="false"
    class="flex flex-col gap-2 relative h-full"
  >
    <template #header>
      <div class="p-2">
        <div class="absolute left-0 top-0 z-10 hidden h-full w-full bg-black/10 visible" />
        <IBImage
          :img="{
            src: `conference/speakers/${speaker.avatar}.jpg`,
            alt: `${speaker.given_name} will be presenting at the Dark Sky Conservation India Conference`,
            width: '350',
            height: '350',
            loading: 'lazy',
            quality: '80',
            format: 'webp',
          }"
          class="w-full object-cover grayscale-[20%] rounded-t-xl overflow-hidden"
        />
      </div>
    </template>
    <div class="p-6 flex flex-col justify-between flex-grow min-h-full">
      <div class="flex flex-col flex-grow gap-4 text-sm pb-4">
        <h3 class="text-2xl font-semibold">
          {{ speaker.title }} {{ speaker.given_name }} {{ speaker.surname }}
        </h3>
        <p class="flex items-center gap-2 font-semibold text-primary-600">
          <Icon
            name="mdi:account"
            class="flex-shrink-0"
            size="24px"
          />
          {{ speaker.professional_title }}
        </p>
        <p class="h-auto text-sm"> {{ speaker.bio.slice(0, 240) }}... </p>
      </div>

      <div
        v-if="speaker.abstract"
        class="border-color text-white flex w-full flex-col justify-end gap-2 rounded-md border p-4"
        :class="featured ? 'bg-black' : 'bg-primary-950'"
        @click="isOpen = true"
      >
        <h5 class="font-semibold text-white"> Abstract </h5>
        <p class="text-sm">
          {{ speaker.abstract.title }}
        </p>
        <PrimeDialog
          v-model:visible="isOpen"
          modal
          :closable="true"
          :dismissable-mask="true"
          :header="speaker.abstract.title"
          :style="{ width: '60rem' }"
          :breakpoints="{ '1199px': '75vw', '575px': '90vw' }"
        >
          <p>
            {{ speaker.abstract.description }}
          </p>
        </PrimeDialog>
      </div>
    </div>
  </LandingGlass>
</template>

<style scoped></style>
