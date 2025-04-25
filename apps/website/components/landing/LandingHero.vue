<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

// Simplified and more impactful word rotation
const highlightedWords = ['Discover', 'Explore', 'Experience']
const currentWord = ref(highlightedWords[0])
const isTransitioning = ref(false)
const videoLoaded = ref(false)
const videoElement = ref<HTMLVideoElement | null>(null)

const rotateWords = () => {
  if (isTransitioning.value) return

  isTransitioning.value = true
  const currentIndex = highlightedWords.indexOf(currentWord.value)
  const nextIndex = (currentIndex + 1) % highlightedWords.length

  gsap.to('.highlight-word', {
    y: 40,
    opacity: 0,
    duration: 0.4,
    onComplete: () => {
      currentWord.value = highlightedWords[nextIndex]
      gsap.fromTo('.highlight-word', { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4 })
      isTransitioning.value = false
    },
  })
}

const handleVideoLoad = () => {
  videoLoaded.value = true
  if (videoElement.value) {
    videoElement.value.play().catch(console.error)
  }
  gsap.to('.video-fade-in', {
    opacity: 1,
    duration: 1.5,
    ease: 'power2.out',
  })
}

let wordRotationInterval: number | null = null

onMounted(() => {
  if (import.meta.client) {
    gsap.from('.hero-content', {
      y: 30,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
    })

    if (videoElement.value) {
      videoElement.value.play().catch(console.error)
    }

    wordRotationInterval = setInterval(rotateWords, 3000)
  }
})

onUnmounted(() => {
  if (wordRotationInterval) {
    clearInterval(wordRotationInterval)
  }
})

const { loginPath, authURL } = useRuntimeConfig().public

const fullLoginPath = computed(() => {
  if (!authURL || !loginPath) return null
  try {
    return new URL(loginPath, authURL).toString()
  } catch {
    return null
  }
})
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <div class="absolute inset-0">
      <ClientOnly>
        <template #fallback>
          <NuxtImg
            src="images/hero-image.jpg"
            alt="Space background"
            class="absolute inset-0 w-full h-full object-cover"
          />
        </template>

        <NuxtImg
          v-show="!videoLoaded"
          src="images/hero-image.jpg"
          alt="Space background"
          class="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
        />

        <video
          ref="videoElement"
          class="video-fade-in absolute inset-0 w-full h-full object-cover"
          :class="{ 'opacity-0': !videoLoaded }"
          muted
          loop
          playsinline
          preload="auto"
          poster="/images/hero-image.jpg"
          @loadeddata="handleVideoLoad"
        >
          <source
            src="/videos/astronera-hero-video.mp4"
            type="video/mp4"
          />
        </video>
      </ClientOnly>

      <!-- Gradient overlay -->
      <div
        class="absolute inset-0"
        style="
          background: linear-gradient(
            to right,
            rgba(2, 6, 23, 0.95) 0%,
            rgba(2, 6, 23, 0.8) 40%,
            rgba(2, 6, 23, 0.1) 100%
          );
        "
      ></div>
    </div>

    <!-- Hero Content -->
    <div
      class="relative z-10 wrapper mx-auto min-h-screen flex items-center justify-center text-center"
    >
      <div class="hero-content max-w-4xl py-20">
        <div class="space-y-8">
          <!-- Main tagline -->
          <h1
            class="font-space-grotesk text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-tight tracking-tight"
          >
            A Cosmos to
            <div class="relative block mt-4">
              <span
                :key="currentWord"
                class="highlight-word block text-sky-400 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent"
              >
                {{ currentWord }}
              </span>
            </div>
          </h1>

          <!-- Enhanced subtitle -->
          <p class="font-inter text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Your gateway to space exploration. Breaking news, mission updates, and astronomical
            discoveries —
            <span class="text-sky-400">100% free</span>.
          </p>

          <!-- CTA section -->
          <div class="flex flex sm:flex-row justify-center gap-4 pt-8">
            <NuxtLink
              v-if="fullLoginPath"
              :to="fullLoginPath"
              external
            >
              <PrimeButton
                size="large"
                class="font-inter bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 text-lg px-8"
              >
                🚀 Start Reading
              </PrimeButton>
            </NuxtLink>
            <NuxtLink to="/darksky">
              <PrimeButton
                size="large"
                class="font-inter bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 transition-all duration-300 text-lg px-8"
              >
                🌃 Dark Sky
              </PrimeButton>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Scroll indicator -->
    <div class="absolute bottom-8 w-full flex justify-center">
      <div class="flex flex-col items-center gap-2">
        <span class="font-inter text-sm text-gray-400">Scroll to explore</span>
        <div class="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center">
          <div class="w-1.5 h-3 bg-sky-400 rounded-full mt-2 animate-bounce"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
.video-fade-in {
  transition: opacity 1.5s ease-out;
}

.highlight-word {
  transition: all 0.4s ease-out;
}
</style>
