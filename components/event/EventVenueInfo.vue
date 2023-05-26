<template>
  <div>
    <span
      v-if="time"
      class="block text-sm text-[#8492a6] font-light"
    >
      {{ time.day }} {{ time.month }}, {{ time.time }} {{ time.ampm }}
    </span>
    <NuxtLink :to="`/venues/${venue.id}`">
      <div class="pb-4 pl-4 text-xs flex items-center space-x-4 text-gray-500">
        <div class="pl-2">
          <UIcon
            name="uil:location-point"
            size="20px"
          />
        </div>
        <div class="flex flex-col">
          <h3 class="m-0 text-gray-700 font-semibold">
            {{ venue.name }}
          </h3>
          <p class="m-0 text-gray-500">
            {{ venue.location.country }}, {{ venue.location.state }},
            {{ venue.location.city }}
          </p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { VenueBasic } from '@/types'

defineProps({
  venue: {
    type: Object as PropType<VenueBasic>,
    required: true
  },
  time: {
    type: Object as PropType<any>,
    required: true
  }
})
</script>

<style scoped></style>
