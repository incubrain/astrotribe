<template>
  <div class="m-0 relative flex flex-col justify-start animate-swipe-in scale-x-0 origin-left text-black">
    <NuxtLink :to="`/venues/${p.venue.id}`">
      <img
        :src="u.venues.featuredImage(p.venue.id, p.venue.featured_image)"
        :alt="`${p.venue.name} AstroTribe featured image`"
        class="aspect-square object-contain w-full rounded-lg overflow-hidden shadow-lg"
      />
      <div class="p-2 flex flex-col gap-2">
        <div class="flex justify-between text-gray-700">
          <h3 class="text-base font-semibold">{{ p.venue.name?.substring(0, 30) }}...</h3>
          <span v-if="p.venue.rating" class="flex items-center gap-1">
            <Icon
              name="material-symbols:star"
              size="18px"
              class="text-yellow-400"
            />
            <p class="text-xs font-semibold"> {{ p.venue.rating.toPrecision(2) }} </p>
          </span>
        </div>
        <div class="flex flex-col text-sm gap-2 text-gray-500">
          <p>{{ p.venue.location.state }}, {{ p.venue.location.country }}</p>
          <p>{{ p.venue.events_hosted }} events hosted</p>
        </div>
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { Venue } from '@/types/types'

const p = defineProps({
  venue: {
    type: Object as PropType<Venue>,
    required: true
  }
})

const u = useUtils()
</script>

<style scoped></style>
