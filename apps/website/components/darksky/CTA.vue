<script setup lang="ts">
defineProps<{
  text: string
  buttonText?: string
  buttonLink?: string
}>()
</script>

<template>
  <section class="py-16 text-center mb-12">
    <LandingGlass
      hover-effect="glow"
      glow-color="mixed"
      gradient="mixed"
      intensity="medium"
      interactive
    >
      <h2 class="text-4xl font-bold mb-6 text-white">Ready to Make a Difference?</h2>
      <p class="text-xl mb-8 max-w-2xl mx-auto">{{ text }}</p>

      <NuxtLink :to="buttonLink || '/darksky'">
        <PrimeButton
          size="large"
          class="font-inter bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 text-lg px-8 py-4"
        >
          <Icon
            name="mdi:star"
            class="mr-2"
          />
          {{ buttonText || 'Get Involved!' }}
        </PrimeButton>
      </NuxtLink>
    </LandingGlass>
  </section>
</template>
