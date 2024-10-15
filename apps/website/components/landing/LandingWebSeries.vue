<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const loadVideo = ref(false)

onMounted(() => {
  gsap.from('.youtube-section', {
    scrollTrigger: {
      trigger: '.youtube-section',
      start: 'top bottom-=100px',
      toggleActions: 'play none none reverse',
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
  })
})
</script>

<template>
  <section class="youtube-section py-16">
    <div class="container mx-auto px-4">
      <h2 class="text-3xl md:text-4xl font-bold text-center mb-8 font-space">
        Follow the development of AstronEra in "Startups Guide to the Galaxy"
      </h2>
      <div class="p-4 lg:p-8 rounded-lg background border border-color">
        <div class="aspect-video relative \">
          <img
            src="https://img.youtube.com/vi/gMG621m6QRE/hqdefault.jpg"
            alt="Startups Guide to the Galaxy - AstronEra"
            class="w-full h-full object-cover rounded-lg shadow-lg cursor-pointer"
            @click="loadVideo = true"
          />
          <div
            v-if="loadVideo"
            class="absolute inset-0"
          >
            <iframe
              src="https://www.youtube.com/embed/gMG621m6QRE?start=488&autoplay=1"
              title="Startups Guide to the Galaxy - AstronEra"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
              class="w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-8 flex justify-center">
      <div class="max-w-md background border border-color rounded-lg shadow-lg p-6 text-center">
        <h3 class="text-2xl font-bold mb-4">Support Us on Patreon</h3>
        <p class="mb-6">
          Get behind-the-scenes access and exclusive content about starting, growing, and running a
          SaaS company.
        </p>
        <a
          href="https://www.patreon.com/YourPatreonLink"
          target="_blank"
          class="inline-block bg-primary-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition-colors"
        >
          Become a Patron
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
