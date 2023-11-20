<template>
  <div
    class="relative flex flex-col text-left origin-left md:rounded-lg md:overflow-hidden animate-swipe-in border border-color background"
  >
    <NuxtImg
      :src="venue.featured_image"
      loading="lazy"
      :alt="`${venue.name} AstroTribe featured image`"
      width="340"
      height="250"
      class="object-contain w-full aspect-square"
    />
    <div
      class="absolute w-12 h-12 p-1 overflow-hidden rounded-full left-2 top-2"
      :class="getBG(venue.id)"
    >
      <NuxtImg
        :src="venue.logo"
        loading="lazy"
        :alt="`${venue.name} AstroTribe featured image`"
        width="250"
        height="250"
        quality="80"
        class="object-contain w-full aspect-square"
      />
    </div>
    <div class="flex flex-col gap-2 p-4 md:h-full justify-between">
      <div class="flex flex-col">
        <h3 class="text-base font-semibold">
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
        <div class="flex flex-col gap-2 text-sm pt-2">
          <p>{{ venue.location.state }}, {{ venue.location.country }}</p>
          <p>{{ venue.body }}</p>
        </div>
      </div>
      <a
        :href="venue.website"
        target="_blank"
        class="mt-4"
      >
        <UButton
          variant="outline"
          block
          color="white"
        >
          More info
        </UButton>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VenueType } from '@/types/events'

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
    type: Object as PropType<VenueType>,
    required: true
  }
})
</script>

<style scoped></style>
