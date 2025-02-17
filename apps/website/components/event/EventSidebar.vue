<script setup lang="ts">
defineProps({
  categories: {
    type: Array<Record<string, any>>,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col gap-4 p-3">
    <h2 class="text-xl">Monthly Calendar Astronomical Events</h2>
    <div>
      <h3 class="text-xl">Event Categories</h3>
      <ul class="flex justify-between flex-wrap md:block">
        <li
          class="flex gap-1 items-center"
          v-for="category in categories"
        >
          <div :class="`rounded bg-${category.color}-${category.colorIntensity} w-5 h-3`" />
          {{ category.name }}
        </li>
      </ul>
      <i class="mdi:event-heart" />
    </div>
  </div>
</template>

<style scoped />
