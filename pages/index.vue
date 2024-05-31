<script setup lang="ts">
definePageMeta({
  name: 'Home'
})
// !todo:low look into subtle black and white images or patterns to give the background some flair
</script>

<template>
  <div class="relative z-0">
    <HomeHero />
    <div class="wrapper padded-x">
      <HomeTrusted />
      <LazyHomeFeatures class="py-16 md:py-24" />
      <LazyHomeHeading
        heading="That's not all..."
        subheading="We Have Some Big Plans!"
        class="pb-16 md:pb-24"
      />
      <!-- <LazyHomeFeatureTabs class="pb-16 md:pb-24" /> -->
    </div>
    <LazyHomeCtaMain
      class="py-16 md:py-24 border-y border-color"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div class="wrapper padded-x mx-auto flex flex-col py-16 md:py-24">
      <LazyHomeTestimonial class="pb-6 xl:pb-12" />
    </div>
  </div>
</template>

<style scoped></style>
