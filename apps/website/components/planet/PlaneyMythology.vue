<script setup lang="ts">
// 1. Imports
import type { MythologyInfo } from '~/types/solarsystem'

// 2. Component Options
defineOptions({
  name: 'MythologySection',
})

// 3. Props and Emits
const props = defineProps<{
  mythology: MythologyInfo
}>()
</script>

<template>
  <div class="mb-16 bg-primary-900/30 backdrop-blur-sm rounded-lg p-6 border border-primary-800/30">
    <h2 class="text-2xl font-bold mb-6 text-primary-400">Mythology & Origin</h2>
    <div>
      <h3 class="text-xl font-bold mb-2"> {{ mythology.name }} ({{ mythology.origin }} Origin) </h3>
      <p class="mb-4">{{ mythology.description }}</p>
      <p>{{ mythology.significance }}</p>
    </div>
  </div>
</template>
