<template>
    <div
        class="min-h-full grid 
        grid-cols-[minmax(160px,1fr)]
        md:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)]
        2xl:grid-cols-[minmax(160px,1fr)_minmax(160px,1fr)_minmax(160px,1fr)]
        rounded-md shadow-sm gap-6
        "
    >
        <CardEvent
            v-for="event in e.events"
            :key="event.id"
            :title="event.title"
            :description="event.body"
            :date="event.date"
            :venue="event.venues"
            :hosts="event.event_hosts"
        />
    </div>
</template>

<script setup lang="ts">

definePageMeta({ name: 'Upcoming' })

const e = useEventsStore()

e.getEvents()

</script>