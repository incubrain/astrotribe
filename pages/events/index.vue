<template>
    <div
        class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
        2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        rounded-md shadow-sm gap-8
        "
    >
        <CardEvent
            v-for="event in s.events"
            :key="event.id"
            :event="event"
        />
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'Upcoming' })

const e = useEventsStore()
e.getEvents()

const s = appState()

</script>