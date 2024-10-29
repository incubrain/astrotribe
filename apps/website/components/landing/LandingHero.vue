<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const highlightedWords = ['Discover', 'Innovate', 'Explore']
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

let wordRotationInterval: number | null = null

// Use onMounted instead of nuxtApp.hook
onMounted(() => {
  if (import.meta.client) {
    // Initial animations with a slight delay to ensure DOM is ready
    setTimeout(() => {
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
    }, 100)

    // Initialize video
    if (videoElement.value) {
      videoElement.value.play().catch(console.error)
    }

    // Start word rotation
    wordRotationInterval = setInterval(rotateWords, 3000)

    // Add scroll listener
    window.addEventListener('scroll', handleScroll)
  }
})

// Clean up with onUnmounted
onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
    if (wordRotationInterval) {
      clearInterval(wordRotationInterval)
    }
  }
})
</script>

<!-- Template remains the same -->
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
          A Cosmos to
          <div class="relative block mt-2">
            <span
              :key="currentWord"
              class="highlight-word transition-all duration-500 ease-out block text-primary-400"
            >
              {{ currentWord }}</span
            >
          </div>
        </h1>

        <p class="hero-subtitle text-lg md:text-xl text-gray-200 max-w-md mb-12">
          Your daily dose of astronomical discoveries, mission updates, and space-tech insights.
        </p>

        <div class="hero-cta flex gap-4">
          <PrimeButton size="large"> 🚀 Get Started </PrimeButton>
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
.video-fade-in {
  transition: opacity 1s ease-out;
}
</style>
