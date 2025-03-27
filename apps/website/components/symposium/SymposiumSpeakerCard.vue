<script setup lang="ts">
// 1. Imports
import { ref } from 'vue'

// 2. Component Options
defineOptions({
  name: 'SymposiumSpeakerCard',
})

// 3. Reactive Variables
const isOpen = ref(false)

// 4. Props and Emits
const props = defineProps({
  speaker: {
    type: Object,
    required: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div
    class="bg-primary-800/30 backdrop-blur-sm rounded-lg overflow-hidden border border-primary-700/30 h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:border-primary-600/50"
  >
    <!-- Speaker Image -->
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

      <!-- Online/In-person indicator -->
      <div
        v-if="speaker.inPerson !== undefined"
        class="absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium"
        :class="speaker.inPerson ? 'bg-emerald-500/80 text-white' : 'bg-blue-500/80 text-white'"
      >
        {{ speaker.inPerson ? 'In-Person' : 'Online' }}
      </div>

      <!-- Featured badge -->
      <div
        v-if="featured"
        class="absolute top-4 left-4 bg-primary-500/80 text-white px-3 py-1 rounded-full text-xs font-medium"
      >
        Featured
      </div>
    </div>

    <!-- Speaker Info -->
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

      <div class="flex-grow">
        <p
          v-if="!isOpen && speaker.bio"
          class="text-sm text-gray-300 line-clamp-3"
        >
          {{ speaker.bio.slice(0, 240) }}...
        </p>
        <p
          v-else-if="speaker.bio"
          class="text-sm text-gray-300"
        >
          {{ speaker.bio }}
        </p>

        <button
          v-if="speaker.bio && speaker.bio.length > 240"
          class="mt-2 text-primary-400 text-sm font-medium hover:text-primary-300 transition-colors duration-200 flex items-center gap-1"
          @click="isOpen = !isOpen"
        >
          {{ isOpen ? 'Read Less' : 'Read More' }}
          <Icon
            :name="isOpen ? 'mdi:chevron-up' : 'mdi:chevron-down'"
            size="16"
          />
        </button>
      </div>

      <!-- Abstract/Topic Preview -->
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
