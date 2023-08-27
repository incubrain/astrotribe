<template>
  <div class="relative z-0">
    <HomeHero />
    <div class="container">
      <HomeTrusted />
      <HomeFeatures class="py-16 md:py-24" />
      <HomeHeading
        heading="That's not all..."
        subheading="We Have Some Big Plans!"
        class="pb-16 md:pb-24"
      />
      <HomeProductStep
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
    <HomeCtaMain
      class="py-16 md:py-24"
      title="Earlybird Exclusive Benefits"
      body="The first 50 people will get exclusive life-time free use of our platform"
      cta="Claim your spot"
    />
    <div
      class="max-w-[1040px] mx-auto flex flex-col py-16 md:py-24 px-[20px] md:px-[80px] lg:px-[160px]"
    >
      <HomeTestimonial />
      <HomeCtaSecond
        title="Host Stargazing Events"
        body="Share your passion for the stars. Organize stargazing events and connect with local enthusiasts."
      >
        <NuxtLink to="auth/register">
          <UButton
            color="white"
            size="xl"
          >
            Create an Event Now
          </UButton>
        </NuxtLink>
      </HomeCtaSecond>
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
