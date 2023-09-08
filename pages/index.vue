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
      <div class="grid items-start gap-6 xl:gap-12 grid-cols-1 md:grid-cols-2">
        <HomeCtaSecond
          alignement="left"
          title="Dark Sky Conservation India Conference"
          body="We're hosting a conference in Manali, Himachal Pradesh, India. Join us in person or virtually from home. Delve into captivating sessions and connect with astronomy enthusiasts"
        >
          <UButton
            color="white"
            to="/conference"
            block
          >
            Find Out More
          </UButton>
        </HomeCtaSecond>
        <HomeCtaSecond
          alignement="left"
          title="Dark Sky Conservation Poster Competition"
          body="Do you have design skills and an interest in astronomy? We've created a poster competition to help raise awareness about light pollution and the importance of dark skies."
        >
          <UButton
            color="white"
            to="/poster-competition"
            block
          >
            Find Out More
          </UButton>
        </HomeCtaSecond>
      </div>
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
