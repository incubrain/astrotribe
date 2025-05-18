<script setup lang="ts">
import { ref } from 'vue'

const bioPopover = ref(null)
const bioButton = ref(null)

defineOptions({
  name: 'SymposiumSpeakerCard',
})

defineProps({
  speaker: {
    type: Object,
    required: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
})

const BIO_PREVIEW_LENGTH = 240

function openBioPopover() {
  if (bioPopover.value && bioButton.value?.$el) {
    bioPopover.value.toggle({ currentTarget: bioButton.value.$el })
  }
}
</script>

<template>
  <div
    class="bg-primary-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-700/30 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary-600/50"
  >
    <!-- Image -->
    <div class="relative">
      <IBImage
        :img="{
          src: `/symposium/speakers/${speaker.avatar}.jpeg`,
          alt: `${speaker.given_name} ${speaker.surname} - Speaker at the Dark Sky Symposium`,
          width: 400,
          height: 400,
        }"
        class="w-full aspect-square object-cover"
      />

      <div
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/80 text-white"
      >
        Online
      </div>

      <div
        v-if="isFeatured"
        class="absolute top-4 left-4 bg-primary-500/80 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        Featured
      </div>
    </div>

    <!-- Info -->
    <div class="p-5 flex flex-col flex-grow">
      <h3 class="text-xl font-bold text-primary-300 mb-2">
        {{ speaker.title ? `${speaker.title} ` : '' }}{{ speaker.given_name }} {{ speaker.surname }}
      </h3>

      <div class="flex items-center gap-2 mb-4">
        <Icon
          name="mdi:briefcase-outline"
          size="18"
          class="text-primary-400"
        />
        <p class="text-sm text-primary-400 font-medium">{{ speaker.professional_title }}</p>
      </div>

      <!-- Bio preview with popover -->
      <div v-if="speaker.bio">
        <button
          ref="bioButton"
          class="text-sm text-gray-300 line-clamp-3 text-left w-full hover:underline"
          @click="openBioPopover"
        >
          {{ speaker.bio.slice(0, BIO_PREVIEW_LENGTH) }}...
        </button>

        <PrimePopover
          ref="bioPopover"
          :target="bioButton?.$el"
          position="top"
          class="dark-mode-popover"
        >
          <div class="p-4 max-w-sm text-sm text-gray-100 whitespace-pre-line">
            {{ speaker.bio }}
          </div>
        </PrimePopover>
      </div>

      <!-- Abstract -->
      <div
        v-if="speaker.abstract"
        class="mt-4 p-3 bg-primary-900/60 rounded-md border border-primary-800/50"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon
            name="mdi:presentation"
            size="18"
            class="text-primary-400"
          />
          <h4 class="text-sm font-semibold text-primary-300">Topic</h4>
        </div>
        <p class="text-sm text-gray-300">{{ speaker.abstract.title }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.dark-mode-popover.p-popover) {
  border-radius: 0.5rem;
  border: 1px solid rgba(71, 85, 105, 0.4);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.6);
}

:deep(.dark-mode-popover .p-popover-content) {
  padding: 0;
  background-color: #1e293b;
  color: white;
}

:deep(.dark-mode-popover .p-popover-arrow) {
  display: none;
}
</style>
