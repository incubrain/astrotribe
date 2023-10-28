<template>
  <div class="relative z-0">
    <HomeHero />
    <div class="container">
      <HomeTrusted />
      <LazyHomeFeatures class="py-16 md:py-24" />
      <LazyHomeHeading
        heading="That's not all..."
        subheading="We Have Some Big Plans!"
        class="pb-16 md:pb-24"
      />
      <LazyHomeProductStep
        v-for="step in productSteps"
        :key="step.id"
        :image-right="step.imageRight"
        :img-src="step.imgSrc"
        :title="step.title"
        :body="step.body"
        :cta="step.cta"
        class="pb-16 md:pb-24"
      />
    </div>
    <LazyHomeCtaMain
      class="py-16 md:py-24"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div
      class="max-w-[1040px] mx-auto flex flex-col py-16 md:py-24 px-[20px] md:px-[80px] lg:px-[160px]"
    >
      <LazyHomeTestimonial class="pb-6 xl:pb-12" />
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
