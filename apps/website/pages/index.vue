<script setup lang="ts"></script>

<template>
  <div>
    <LandingHero />

    <main class="space-y-36 py-24 overflow-hidden max-w-full">
      <LandingSidescroll />
      <LazyLandingProductSteps class="wrapper" />
      <LazyLandingFeatures class="wrapper" />
      <LazyLandingTestimonials class="max-w-full w-full" />
      <LazyLandingWebSeries class="wrapper" />
    </main>
  </div>
</template>
