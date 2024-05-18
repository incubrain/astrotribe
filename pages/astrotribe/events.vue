<script setup lang="ts">
const domainKey = 'events'
const eventsStore = useEventsStore()
const { events } = storeToRefs(eventsStore)

const haveEvents = computed(() => events.value !== null && events.value.length > 0)

const fetchInput = ref({
  domainKey,
  endpoint: '/api/events/select/cards',
  criteria: {
    dto: 'select:events:card'
  }
}) as Ref<FetchInput>

watchEffect(() => {
  if (haveEvents.value === false) {
    console.log('Fetching events')
    eventsStore.loadEvents(fetchInput.value)
  }
})

const loading = useLoadingStore()
const isLoading = computed(() => loading.isLoading(domainKey))

definePageMeta({ name: 'Events', layout: 'app' })
</script>

<template>
  <div>
    <BaseInfiniteScroll
      :domain-key="domainKey"
      :pagination="{
        page: 1,
        limit: 20
      }"
      @update:scroll-end="eventsStore.loadEvents(fetchInput)"
    >
      <div
        v-if="haveEvents"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-4 xl:gap-8"
      >
        <EventCard
          v-for="(event, i) in events"
          :key="`events-post-${i}`"
          :events="event"
        />
      </div>
      <div
        v-else
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 md:gap-4 2xl:gap-8"
      >
        <div class="p-8 space-y-1 rounded-md shadow-md foreground">
          <h3 class="pb-4 text-xl font-semibold"> No events to show, check back soon. </h3>
          <p>
            We have regularly scheduled events and are in the process of getting this page working.
          </p>
        </div>
      </div>
    </BaseInfiniteScroll>
  </div>
</template>
