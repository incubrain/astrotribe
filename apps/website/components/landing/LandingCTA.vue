<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRuntimeConfig } from '#app'

gsap.registerPlugin(ScrollTrigger)

const props = defineProps<{
  title: string
  subtitle: string
  buttonText: string
}>()

const config = useRuntimeConfig()
const authLink = config.public.aeAuthLink

onMounted(() => {
  gsap.from('.cta-content', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    x: -50,
    opacity: 0,
    duration: 0.8,
  })

  gsap.from('.cta-image', {
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    x: 50,
    opacity: 0,
    duration: 0.8,
  })
})
</script>

<template>
  <section class="cta-section bg-primary-900 py-16">
    <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
      <div class="cta-content text-white md:w-1/2 mb-8 md:mb-0">
        <h2 class="text-2xl md:text-3xl font-bold mb-4 font-space">
          {{ title }}
        </h2>
        <p class="text-xl mb-8">{{ subtitle }}</p>
        <NuxtLink
          :to="authLink"
          class="inline-block"
        >
          <PrimeButton
            :label="buttonText"
            severity="secondary"
          />
        </NuxtLink>
      </div>
      <div class="md:w-1/2 cta-image">
        <NuxtImg
          src="https://picsum.photos/800/600"
          alt="CTA Image"
          class="rounded-lg w-full h-auto shadow-2xl shadow-black"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}
</style>
