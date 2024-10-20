<script setup lang="ts">
// No GSAP-related code here anymore
</script>

<template>
  <div>
    <LandingHero class="pb-24" />

    <main class="space-y-24 overflow-hidden max-w-full">
      <LazyLandingFeatures class="wrapper overflow-hidden mx-auto px-4 sm:px-6 lg:px-8" />
      <LazyLandingProductSteps class="wrapper mx-auto px-4 sm:px-6 lg:px-8" />
      <LazyLandingTestimonials class="max-w-full w-full" />
      <LandingTrusted />
      <LazyLandingFuture class="wrapper mx-auto px-4 sm:px-6 lg:px-8" />
      <LazyLandingPricing class="wrapper mx-auto px-4 sm:px-6 lg:px-8" />
      <LazyLandingCTA
        title="The best offer for your space exploration"
        subtitle="Join AstroTribe today and unlock a universe of knowledge!"
        button-text="Get Started"
      />
      <LazyLandingWebSeries class="wrapper mx-auto px-4 sm:px-6 lg:px-8" />
    </main>
  </div>
</template>
