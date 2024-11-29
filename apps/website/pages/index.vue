<script setup lang="ts">
import LandingFeatures from '../components/landing/LandingFeatures.vue'
import LandingStats from '../components/landing/LandingStats.vue'

// No GSAP-related code here anymore
</script>

<template>
  <div>
    <LandingHero />

    <main class="space-y-36 py-24 overflow-hidden max-w-full">
      <LandingSidescroll />
      <LazyLandingProductSteps class="container" />
      <LazyLandingFeatures class="container" />
      <!-- <LazyLandingPricing class="container" /> -->
      <!-- <LazyLandingFuture class="container" /> -->
      <LazyLandingTestimonials class="max-w-full w-full" />
      <LazyLandingWebSeries class="container" />
    </main>
  </div>
</template>
