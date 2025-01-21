<script setup lang="ts">
</script>

<template>
  <div>
    <LandingHero />

    <main class="space-y-36 py-24 overflow-hidden max-w-full">
      <LandingSidescroll />
      <LazyLandingProductSteps class="container" />
      <LazyLandingFeatures class="container" />
      <LazyLandingTestimonials class="max-w-full w-full" />
      <LazyLandingWebSeries class="container" />
    </main>
  </div>
</template>
