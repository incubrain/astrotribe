<template>
  <div>
    <HomeHero />
    <div class="max-w-[1240px] mx-auto flex flex-col pt-32 px-home">
      <HomeTrusted />
      <HomeFeatures />
      <HomeProductStep
        :image-right="true"
        cta="Find out more"
        title="Step 1"
        body="This is an amazing feature This is an amazing feature This is an amazing feature This is an amazing feature"
      />
      <HomeProductStep
        :image-right="false"
        cta="Find out more"
        title="Step 2"
        body="This is a 2nd amazing feature"
      />
      <HomeProductStep
        :image-right="true"
        cta="Find out more"
        title="Step 3"
        body="This is a 3rd amazing feature"
      />
    </div>
    <HomeCtaMain
      cta="Get Started Now"
      title="Call to Action"
      body="Some more information about AstroTribe that spills onto the second line"
    />
    <div class="max-w-[1240px] mx-auto flex flex-col pb-32 px-home">
      <!-- <HomeTestimonial /> -->
      <HomeTimeline />
      <HomeCtaSecond
        cta="Get Started Now"
        title="Going to the moon"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  name: 'Home',
  layout: 'home'
})
</script>

<style scoped></style>
