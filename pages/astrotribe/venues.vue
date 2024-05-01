<script setup lang="ts">
const venuesStore = useVenuesStore()

const { venues } = storeToRefs(venuesStore)
const haveVenues = computed(() => venues.value !== null && venues.value.length > 0)

const paginationStore = usePaginationStore()

const fetchInput = ref({
  storeKey: 'venuesStore',
  endpoint: '/api/venues/select/cards',
  criteria: {
    dto: 'select:venues:card',
    pagination: paginationStore.getPaginationRange('venuesStore')
  }
})

watchEffect(() => {
  if (haveVenues.value === false) {
    console.log('Fetching venues')
    venuesStore.loadVenues(fetchInput.value)
  }
})

console.log('venues', venues)

definePageMeta({ name: 'Venues', layout: 'app' })
</script>

<template>
  <div>
    <BaseInfiniteScroll
      store-key="venuesStore"
      :pagination="{
        page: 1,
        limit: 10
      }"
      @update:scroll-end="venuesStore.loadVenues('select:venue:card')"
    >
      <div v-if="haveVenues">
        <BaseGrid>
          <VenueCard
            v-for="(venue, i) in venues"
            :key="`venue-card-${i}`"
            :venue="venue"
          />
        </BaseGrid>
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
    </BaseInfiniteScroll>
  </div>
</template>
