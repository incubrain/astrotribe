<template>
  <div class="px-4 pb-4">
    <div class="flex items-center space-x-4 text-xs">
      <div class="pl-2">
        <UIcon
          name="i-material-symbols-location-on-rounded"
          class="w-4 h-4"
        />
      </div>
      <div class="flex flex-col">
        <h3 class="m-0 font-semibold">
          {{ venue.name }}
        </h3>
        <p class="m-0">
          {{ venue.location.city }}, {{ venue.location.state }}, {{ venue.location.country }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VenueType } from '@/types/events'

defineProps({
  venue: {
    type: Object as PropType<VenueType>,
    required: true
  }
})
</script>

<style scoped></style>
