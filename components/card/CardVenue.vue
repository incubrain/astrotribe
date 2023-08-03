<template>
  <div
    class="relative flex flex-col text-left origin-left md:rounded-lg md:overflow-hidden animate-swipe-in"
  >
    <NuxtImg
      :src="venue.featured_image"
      loading="lazy"
      :alt="`${venue.name} AstroTribe featured image`"
      width="340"
      height="250"
      class="object-contain w-full aspect-square"
    />
    <div class="absolute w-12 h-12 p-1 overflow-hidden rounded-full left-2 top-2" :class="getBG(venue.id)">
      <NuxtImg
        :src="venue.logo"
        loading="lazy"
        :alt="`${venue.name} Logo on AstroTribe`"
        width="80"
        height="80"
        class="object-contain w-full aspect-square"
      />
    </div>
    <div class="flex flex-col gap-4 p-4 foreground md:h-full justify-between">
      <div class="flex flex-col gap-2">
        <h3 class="text-base font-semibold">
          <UIcon
            name="i-material-symbols-location-on"
            class="w-4 h-4"
          />
          {{ venue.name?.substring(0, 30) }}
          {{ venue.name && venue.name.length > 30 ? '...' : '' }}
        </h3>
        <!-- <span
          v-if="venue.avg_rating"
          class="flex items-start gap-1"
        >
          <UIcon
            name="i-material-symbols-star"
            class="w-6 h-6 text-yellow-400"
          />
          <p class="text-xs font-semibold"> {{ venue.avg_rating.toPrecision(2) }} </p>
        </span> -->
        <div class="flex flex-col gap-2 text-sm text-gray-500">
          <p>{{ venue.location.state }}, {{ venue.location.country }}</p>
          <p>{{ venue.body }}</p>
        </div>
      </div>
      <a
        :href="venue.website"
        target="_blank"
      >
        <UButton
          variant="outline"
          block
          color="slate"
        >
          More info
        </UButton>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Venue } from '@/types/zod/events'

const getBG = (id: number) => {
  const darkBG = [3]

  if (darkBG.includes(id)) {
    return 'bg-slate-950'
  } else {
    return 'bg-light'
  }
}

defineProps({
  venue: {
    type: Object as PropType<Venue>,
    required: true
  }
})
</script>

<style scoped></style>
