<template>
  <div>
    <HomeHero />
    <div class="max-w-[1240px] mx-auto flex flex-col gap-32 py-32">
      <HomeFeatures />
      <HomeWorld />
      <!-- <HomeTrusted /> -->
      <HomeTestimonial />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Home',
  layout: 'home'
})
</script>

<style scoped></style>
