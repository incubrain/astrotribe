<template>
  <div
    class="md:rounded-lg text-left flex relative flex-col md:overflow-hidden animate-swipe-in origin-left border-b border-slate-300"
  >
    <NuxtLink
      :to="`/venues/${p.venue.id}`"
      class="h-full"
    >
      <img
        :src="u.venues.featuredImage(p.venue.id, p.venue.featured_image)"
        :alt="`${p.venue.name} AstroTribe featured image`"
        class="aspect-square object-contain w-full"
      />
      <img
        :src="u.venues.logo(p.venue.id, p.venue.logo)"
        :alt="`${p.venue.name} Logo on AstroTribe`"
        class="aspect-square rounded-full object-contain absolute left-2 top-2 w-12 bg-white p-1"
      />
      <div class="p-4 flex flex-col gap-2 bg-white md:h-full">
        <div class="flex justify-between text-gray-700">
          <h3 class="text-base font-semibold">
            {{ p.venue.name?.substring(0, 30) }}
            {{ p.venue.name && p.venue.name.length > 30 ? '...' : '' }}
          </h3>
          <span
            v-if="p.venue.avg_rating"
            class="flex items-start gap-1"
          >
            <UIcon
              name="i-material-symbols-star"
              class="text-yellow-400 w-6 h-6"
            />
            <p class="text-xs font-semibold"> {{ p.venue.avg_rating.toPrecision(2) }} </p>
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
import type { VenueFull } from '@/types'

const p = defineProps({
  venue: {
    type: Object as PropType<VenueFull>,
    required: true
  }
})

const u = useUtils()
</script>

<style scoped></style>
