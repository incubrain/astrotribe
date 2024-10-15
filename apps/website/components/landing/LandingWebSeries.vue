<script setup lang="ts">
import { onMounted } from 'vue'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

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
      <div class="aspect-w-16 aspect-h-9">
        <iframe
          src="https://www.youtube.com/embed/gMG621m6QRE?start=488"
          title="Startups Guide to the Galaxy - AstronEra"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
          class="w-full h-full rounded-lg shadow-lg"
        ></iframe>
      </div>
    </div>
  </section>
</template>

<style scoped>
.font-space {
  font-family: 'Orbitron', sans-serif;
}

/* Fallback for browsers that don't support aspect-ratio */
@supports not (aspect-ratio: 16 / 9) {
  .aspect-w-16.aspect-h-9 {
    position: relative;
    padding-bottom: 56.25%; /* 9 / 16 * 100% */
  }
  .aspect-w-16.aspect-h-9 iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
