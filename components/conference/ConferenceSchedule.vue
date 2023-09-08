<template>
  <div class="grid items-start grid-cols-1 gap-6 xl:gap-12 lg:grid-cols-2">
    <CommonTitle
      :title="speakers.title"
      :subtitle="speakers.subtitle"
    />
    <CommonTitle
      :title="schedule.title"
      :subtitle="schedule.subtitle"
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
