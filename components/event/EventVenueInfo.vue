<template>
  <div class="px-4 pb-4">
    <NuxtLink :to="`/astrotribe/venues/${venue.id}`">
      <div class="flex items-center space-x-4 text-xs">
        <div class="pl-2">
          <UIcon
            name="i-material-symbols-location-on-rounded"
            size="20px"
          />
        </div>
        <div class="flex flex-col">
          <h3 class="m-0 font-semibold">
            {{ venue.name }}
          </h3>
          <p class="m-0">
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
  }
})
</script>

<style scoped></style>
