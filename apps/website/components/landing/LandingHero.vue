<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'
import { useNuxtApp } from '#app'

const nuxtApp = useNuxtApp()
const highlightedWords = ['Discoveries', 'Innovations', 'Technologies', 'Future']
const currentWord = ref(highlightedWords[0])
const isTransitioning = ref(false)
const scrollY = ref(0)
const videoLoaded = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)

const rotateWords = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  const currentIndex = highlightedWords.indexOf(currentWord.value)
  const nextIndex = (currentIndex + 1) % highlightedWords.length

  gsap.to('.highlight-word', {
    y: 50,
    opacity: 0,
    duration: 0.5,
    onComplete: () => {
      currentWord.value = highlightedWords[nextIndex]
      gsap.fromTo('.highlight-word', { y: -50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5 })
      isTransitioning.value = false
    },
  })
}

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const handleVideoLoad = () => {
  videoLoaded.value = true
  if (videoElement.value) {
    videoElement.value.play().catch((error) => {
      console.error('Video play error:', error)
    })
  }
  gsap.to('.video-fade-in', {
    opacity: 1,
    duration: 1,
    ease: 'power2.out',
  })
}

// Initialize video on client-side only
if (import.meta.client) {
  nuxtApp.hook('app:mounted', () => {
    // Initial animations
    gsap.from('.hero-title', {
      x: -50,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    gsap.from('.hero-subtitle', {
      x: -50,
      opacity: 0,
      duration: 1,
      delay: 0.3,
      ease: 'power3.out',
    })

    gsap.from('.hero-cta', {
      x: -50,
      opacity: 0,
      duration: 1,
      delay: 0.6,
      ease: 'power3.out',
    })

    // Initialize video
    if (videoElement.value) {
      videoElement.value.play().catch(console.error)
    }

    // Start word rotation
    setInterval(rotateWords, 3000)

    window.addEventListener('scroll', handleScroll)
  })

  // Cleanup
  nuxtApp.hook('app:beforeMount', () => {
    window.removeEventListener('scroll', handleScroll)
  })
}
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <!-- Video Background -->
    <div class="absolute inset-0">
      <!-- Thumbnail placeholder (shows until video loads) -->
      <img
        src="/hero-image.jpg"
        alt="Space video thumbnail"
        class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        :class="{ 'opacity-0': videoLoaded }"
      />

      <!-- Video element -->
      <ClientOnly>
        <video
          ref="videoElement"
          class="video-fade-in absolute inset-0 w-full h-full object-cover"
          :class="{ 'opacity-0': !videoLoaded }"
          muted
          loop
          playsinline
          preload="auto"
          poster="/hero-image.jpg"
          @loadeddata="handleVideoLoad"
        >
          <source
            src="/videos/hero.mp4"
            type="video/mp4"
          />
        </video>
      </ClientOnly>

      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-primary-950/10"
        :style="{
          background:
            'linear-gradient(to right, rgba(10, 10, 0, 0.90) 0%, rgba(30, 10, 60, 0.1) 100%)',
        }"
      ></div>
    </div>

    <!-- Rest of the content remains the same -->
    <div class="relative z-10 mx-auto px-12 min-h-screen flex flex-col justify-center">
      <div class="max-w-3xl">
        <h1
          class="hero-title text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Your Gateway to Space
          <div class="relative block mt-2">
            <span class="highlight-word block text-primary-400">{{ currentWord }}</span>
          </div>
        </h1>

        <p class="hero-subtitle text-lg md:text-xl text-gray-200 max-w-2xl mb-12">
          Stay ahead with personalized space and astronomy news, delivered right to your browser's
          new tab
        </p>

        <div class="hero-cta flex gap-4">
          <PrimeButton size="large"> Get Started </PrimeButton>
          <PrimeButton
            severity="secondary"
            size="large"
            outlined
          >
            Learn More
          </PrimeButton>
        </div>
      </div>

      <div class="absolute bottom-8 w-full flex justify-center items-center left-0">
        <div class="w-8 h-14 border-2 border-white/30 rounded-full flex justify-center mx-auto">
          <div class="w-2 h-4 bg-white/60 rounded-full mt-3 animate-bounce"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.highlight-word {
  @apply transition-all duration-500 ease-out;
}

.video-fade-in {
  transition: opacity 1s ease-out;
}
</style>
