<script setup lang="ts">
// No GSAP-related code here anymore
</script>

<template>
  <div>
    <LandingHero />

    <main class="space-y-48 py-24 overflow-hidden max-w-full">
      <LazyLandingFeatures class="container" />
      <LazyLandingProductSteps class="container" />
      <LazyLandingTestimonials class="max-w-full w-full" />
      <LandingTrusted class="container" />
      <LazyLandingFuture class="container" />
      <LazyLandingPricing class="container" />
      <LazyLandingWebSeries class="container" />
    </main>
  </div>
</template>
