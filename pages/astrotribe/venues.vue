<template>
  <div>
    <!-- <UButton class="my-4 ml-4 xl:mb-8 md:mt-0 md:ml-0">
      Submit Your Venue
    </UButton> -->
    <div v-if="venues !== null">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 2xl:gap-8">
        <VenueCard
          v-for="(venue, i) in venues"
          :key="`venue-card-${i}`"
          :venue="venue"
        />
      </div>
    </div>
    <div
      v-else
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 2xl:gap-8"
    >
      <div class="p-8 space-y-1 rounded-md shadow-md foreground">
        <h3 class="pb-4 text-xl font-semibold"> No venues to show, check back soon. </h3>
        <p> We are reaching out to resorts every week to get them on board. </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const ven = useVenuesStore()
ven.checkWeHaveVenues()

const { venues } = storeToRefs(ven)

definePageMeta({ name: 'Venues', layout: 'app' })
</script>
