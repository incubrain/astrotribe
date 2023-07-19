<template>
  <div
    class="relative flex flex-col text-left origin-left md:rounded-lg md:overflow-hidden animate-swipe-in"
  >
    <NuxtLink
      :to="`/astrotribe/venues/${p.venue.id}`"
      class="h-full"
    >
      <NuxtImg
        :src="
          s.image.single({
            bucket: 'venues',
            folderPath: `${p.venue.id}`,
            file: p.venue.featured_image,
            fileType: 'venue-featured-image',
            isPrivate: false,
          })
        "
        loading="lazy"
        :alt="`${p.venue.name} AstroTribe featured image`"
        width="250"
        height="250"
        quality="80"
        class="object-contain w-full aspect-square"
      />
      <div class="absolute w-12 h-12 p-1 overflow-hidden rounded-full left-2 top-2 bg-light">
        <NuxtImg
          :src="
            s.image.single({
              bucket: 'venues',
              folderPath: `${p.venue.id}`,
              file: p.venue.logo!,
              fileType: 'venue-logo',
              isPrivate: false,
            })
          "
          loading="lazy"
          :alt="`${p.venue.name} Logo on AstroTribe`"
          width="80"
          height="80"
          quality="80"
          class="object-contain w-full aspect-square"
        />
      </div>
      <div class="flex flex-col gap-2 p-4 foreground md:h-full">
        <div class="flex justify-between">
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
              class="w-6 h-6 text-yellow-400"
            />
            <p class="text-xs font-semibold"> {{ p.venue.avg_rating.toPrecision(2) }} </p>
          </span>
        </div>
        <!-- <div class="flex flex-col gap-2 text-sm text-gray-500">
          <p>{{ p.venue.location.state }}, {{ p.venue.location.country }}</p>
          <p>{{ p.venue.events_hosted }} events hosted</p>
        </div> -->
      </div>
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
import type { VenueFull } from '@/types'

const s = useStorage()

const p = defineProps({
  venue: {
    type: Object as PropType<VenueFull>,
    required: true
  }
})
</script>

<style scoped></style>
