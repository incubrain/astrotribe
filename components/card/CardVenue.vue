<template>
  <div class="py-4 m-0 relative bg-white rounded-lg overflow-hidden flex flex-col justify-start animate-swipe-in scale-x-0 origin-left text-black">
    <NuxtLink :to="`/venues/${p.venue.id}`">
      <div class="pb-4 pl-4 flex flex-col gap-4 text-gray-500">
        <h3 class="text-2xl font-semibold p-4">{{ p.venue.name }}</h3>
        <img :src="`https://idsifamzvzlpgnmlnldw.supabase.co/storage/v1/object/public/venues-public/${$p.venue.featured_image}`" :alt="` featured image on Astrotribe`">
      </div>
      <div class="pb-4 pl-4 flex items-center gap-4 text-gray-500">
        <div class="bg-gray-100 rounded-full p-2">
          <Icon
            name="uil:location-point"
            size="24px"
          />
        </div>
        <div class="flex flex-col">
          <p>
            {{ p.venue.location.country }}, {{ p.venue.location.state }},
            {{ p.venue.location.city }}
          </p>
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

</script>

<style scoped></style>
