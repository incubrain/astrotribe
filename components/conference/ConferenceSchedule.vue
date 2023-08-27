<template>
  <div class="grid items-start grid-cols-1 gap-8 xl:gap-24 lg:grid-cols-2">
    <ConferenceTitle
      :title="schedule.title"
      :subtitle="schedule.subtitle"
    />
    <ConferenceTitle
      :title="speakers.title"
      :subtitle="speakers.subtitle"
    />
  </div>
</template>

<script setup lang="ts">
const schedule = {
  title: 'Conference Schedule',
  subtitle: 'Coming soon!'
}

const speakers = {
  title: 'Speaker List',
  subtitle: 'Coming soon!'
}
</script>
