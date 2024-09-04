<template>
  <PrimeCard
    :pt="{
      body: 'h-full',
      footer: 'flex justify-end'
    }"
    class="border-color background relative flex origin-left animate-swipe-in flex-col border text-left md:overflow-hidden md:rounded-lg"
  >
    <template #header>
      <div>
        <IBImage
          :img="{
            src: venue.featured_image,
            alt: `${venue.name} AstroTribe featured image`,
            loading: 'lazy',
            width: '340',
            height: '250'
          }"
          class="aspect-video h-full w-full object-cover"
        />
        <div
          class="absolute left-2 top-2 h-12 w-12 overflow-hidden rounded-full p-1"
          :class="getBG(venue.id)"
        >
          <IBImage
            :img="{
              src: venue.logo,
              alt: `${venue.name} AstroTribe featured image`,
              loading: 'lazy',
              width: '60',
              height: '60',
              quality: '80'
            }"
            class="aspect-square w-full object-contain"
          />
        </div>
      </div>
    </template>
    <template #title>
      <h3 class="text-base font-semibold">
        {{ venue.name?.substring(0, 30) }}
        {{ venue.name && venue.name.length > 30 ? '...' : '' }}
      </h3>
    </template>
    <template #subtitle>
      <p>{{ venue.location.state }}, {{ venue.location.country }}</p>
    </template>
    <template #content>
      <div class="flex flex-col justify-between gap-2 md:h-full">
        <div class="flex flex-col">
          <!-- <span
              v-if="venue.avg_rating"
              class="flex items-start gap-1"
            >
              <Icon
                name="material-symbols:star"
                class="w-6 h-6 text-yellow-400"
              />
              <p class="text-xs font-semibold"> {{ venue.avg_rating.toPrecision(2) }} </p>
            </span> -->
          <div class="text-sm">
            <p>{{ venue.body }}</p>
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <a
        :href="venue.website"
        target="_blank"
        class="flex w-full justify-end"
      >
        <PrimeButton
          variant="outline"
          block
          color="white"
        >
          More info
        </PrimeButton>
      </a>
    </template>
  </PrimeCard>
</template>

<script setup lang="ts">
import type { VenueType } from '@/types/events'

const getBG = (id: number) => {
  const darkBG = [3]

  if (darkBG.includes(id)) {
    return 'bg-slate-950'
  } else {
    return 'text-zinc-800 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-300'
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
