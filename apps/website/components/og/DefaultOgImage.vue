<script setup lang="ts">
// 1. Imports
import type { PropType } from 'vue'

// 4. Props and Emits
defineProps({
  title: {
    type: String as PropType<string>,
    required: true,
    default: 'AstronEra: Your Gateway to the Stars',
  },
  description: {
    type: String as PropType<string>,
    required: false,
    default:
      'Connect, learn, and unravel the cosmos with astronomers and space enthusiasts from around the globe',
  },
  image: {
    type: String as PropType<string>,
    required: false,
    default: '/astronera-logo-with-text.jpg',
  },
})
</script>

<template>
  <div class="flex flex-col w-full h-full bg-gray-900 text-white p-12">
    <div class="flex items-center mb-8">
      <img
        src="/astronera-logo-with-text.jpg"
        alt="AstronEra Logo"
        class="h-16"
      />
    </div>

    <div class="flex-1 flex flex-col justify-center items-center text-center px-16">
      <h1 class="text-6xl font-bold mb-8 text-white leading-tight">{{ title }}</h1>
      <p
        v-if="description"
        class="text-2xl text-gray-300"
        >{{ description }}</p
      >
    </div>

    <div class="mt-auto pt-8 border-t border-gray-700 text-center">
      <div class="text-purple-400 text-xl">astronera.org</div>
    </div>
  </div>
</template>
