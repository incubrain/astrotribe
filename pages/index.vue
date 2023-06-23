<template>
  <div class="relative z-0">
    <HomeHero />
    <div class="max-w-[1240px] mx-auto flex flex-col px-[20px] md:px-[80px] lg:px-[160px]">
      <HomeTrusted />
      <HomeFeatures class="py-16 md:py-32" />
      <HomeHeading
        heading="That's not all..."
        subheading="We Have Some Big Plans!"
      />
      <HomeProductStep
        v-for="step in productSteps"
        :key="step.id"
        :image-right="step.imageRight"
        :img-src="step.imgSrc"
        :title="step.title"
        :body="step.body"
        :cta="step.cta"
        class="py-16 md:py-24"
      />
    </div>
    <HomeCtaMain
      class="py-16 md:py-32"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div
      class="max-w-[1040px] mx-auto flex flex-col py-16 md:py-32 px-[20px] md:px-[80px] lg:px-[160px]"
    >
      <HomeTestimonial />
      <HomeCtaSecond
        title="Host Stargazing Events"
        body="Share your passion for the stars. Organize stargazing events and connect with local enthusiasts."
        cta="Plan Your Event Today"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import productSteps from '@/data/home/product-steps.json'

definePageMeta({
  name: 'Home',
  layout: 'home'
})
</script>

<style scoped></style>
