<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const socialMedia = [
  { name: 'LINKEDIN', icon: 'mdi:linkedin', color: 'bg-blue-600' },
  { name: 'TWITTER', icon: 'mdi:twitter', color: 'bg-sky-400' },
  { name: 'YOUTUBE', icon: 'mdi:youtube', color: 'bg-red-600' },
  { name: 'INSTAGRAM', icon: 'mdi:instagram', color: 'bg-purple-600' },
]

onMounted(() => {
  gsap.from('.social-media-cta', {
    scrollTrigger: {
      trigger: '.social-media-cta',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  })

  gsap.from('.social-button', {
    scrollTrigger: {
      trigger: '.social-media-cta',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    scale: 0.5,
    opacity: 0,
    duration: 0.5,
    stagger: 0.1,
  })
})
</script>

<template>
  <section class="py-16">
    <div class="wrapper lg:px-8 mx-auto">
      <div
        class="social-media-cta background border border-color rounded-lg shadow-lg p-8 text-center w-full"
      >
        <h2 class="text-4xl font-bold mb-2">Let's stay in touch</h2>
        <p class="text-2xl mb-8 text-primary-500">Follow us on Social</p>
        <div class="flex flex-wrap justify-center gap-4">
          <a
            v-for="platform in socialMedia"
            :key="platform.name"
            href="#"
            :class="[
              platform.color,
              ' text-white py-2 px-4 rounded-lg flex items-center transition-transform hover:scale-105',
            ]"
          >
            <Icon
              :name="platform.icon"
              size="24"
              class="mr-2"
            />
            {{ platform.name }}
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
