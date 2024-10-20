<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

const titles = ['News', 'Research', 'Companies', 'For All']
const currentTitleIndex = ref(0)
const displayedText = ref('')
const isDeleting = ref(false)
const scrollY = ref(0)

const typingSpeed = 150
const deletingSpeed = 75
const pauseBetweenWords = 1500

const backgroundImages = ['/defaults/cover.jpg', '/defaults/cover.jpg', '/defaults/cover.jpg']
const currentImageIndex = ref(0)

const typeText = () => {
  const currentWord = titles[currentTitleIndex.value]

  if (!isDeleting.value) {
    displayedText.value = currentWord.substring(0, displayedText.value.length + 1)

    if (displayedText.value === currentWord) {
      isDeleting.value = true
      setTimeout(typeText, pauseBetweenWords)
      return
    }
  } else {
    displayedText.value = currentWord.substring(0, displayedText.value.length - 1)

    if (displayedText.value === '') {
      isDeleting.value = false
      currentTitleIndex.value = (currentTitleIndex.value + 1) % titles.length
    }
  }

  setTimeout(typeText, isDeleting.value ? deletingSpeed : typingSpeed)
}

const handleScroll = () => {
  scrollY.value = window.scrollY
}

const changeBackgroundImage = () => {
  gsap.to('.background-image', {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      currentImageIndex.value = (currentImageIndex.value + 1) % backgroundImages.length
      gsap.to('.background-image', {
        opacity: 1,
        duration: 1,
      })
    },
  })
}

onMounted(() => {
  typeText()

  gsap.from('.text-3d', {
    duration: 1.5,
    y: 100,
    opacity: 0,
    ease: 'power3.out',
  })

  gsap.from('.typed-text', {
    duration: 1,
    opacity: 0,
    delay: 0.5,
    ease: 'power2.in',
  })

  window.addEventListener('scroll', handleScroll)

  // Start the background image transition
  setInterval(changeBackgroundImage, 7000)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="relative w-full h-screen overflow-hidden">
    <div
      v-for="(image, index) in backgroundImages"
      :key="index"
      class="background-image absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
      :style="{
        backgroundImage: `url(${image})`,
        opacity: index === currentImageIndex ? 1 : 0,
        transform: `translateY(${scrollY * 0.5}px)`,
      }"
    ></div>

    <!-- Black Overlay -->
    <div class="absolute inset-0 bg-primary-950/30 bg-opacity-40"></div>

    <!-- Content -->
    <div
      class="relative z-10 flex flex-col items-center justify-center h-full text-white"
      :style="{
        transform: `translateY(${scrollY * -0.2}px)`,
      }"
    >
      <!-- Animated Title -->
      <h1
        class="text-5xl md:text-8xl font-bold text-center mb-8 flex justify-center items-center gap-4"
      >
        <span class="block font-space text-glow text-3d">Space</span>
        <span class="inline-block min-w-[8ch] text-left text-3d">
          <span class="typed-text">{{ displayedText }}</span>
          <span class="inline-block w-[2px] h-[1em] bg-white align-middle animate-blink"></span>
        </span>
      </h1>

      <!-- Subtitle -->
      <p class="text-xl sm:text-2xl md:text-3xl text-center mb-8 max-w-3xl">
        Discover the universe with cutting-edge astronomy and space tech news
      </p>

      <!-- CTA Button -->
      <div class="flex gap-4">
        <PrimeButton
          rounded
          size="large"
        >
          Join Now
        </PrimeButton>
        <PrimeButton
          rounded
          outlined
          severity="inverted"
          size="large"
        >
          More Info
        </PrimeButton>
      </div>

      <!-- Scroll Down Icon -->
      <div class="animate-bounce mt-8">
        <Icon
          name="mdi:chevron-down"
          size="48"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes blink {
  0%,
  100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

.animate-blink {
  animation: blink 0.7s step-end infinite;
}

@keyframes fadeInOut {
  0%,
  100% {
    opacity: 0;
    transform: translateY(20px);
  }
  50% {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-bounce {
  animation: fadeInOut 2s infinite;
}

.text-glow {
  text-shadow:
    0 0 10px rgba(255, 255, 255, 0.7),
    0 0 20px rgba(255, 255, 255, 0.5),
    0 0 30px rgba(255, 255, 255, 0.3);
}

.text-3d {
  color: white;
  text-shadow:
    0 1px 0 #cccccc,
    0 2px 0 #c9c9c9,
    0 3px 0 #bbb,
    0 4px 0 #b9b9b9,
    0 5px 0 #aaa,
    0 6px 1px rgba(0, 0, 0, 0.1),
    0 0 5px rgba(0, 0, 0, 0.1),
    0 1px 3px rgba(0, 0, 0, 0.3),
    0 3px 5px rgba(0, 0, 0, 0.2),
    0 5px 10px rgba(0, 0, 0, 0.25),
    0 10px 10px rgba(0, 0, 0, 0.2),
    0 20px 20px rgba(0, 0, 0, 0.15);
}
</style>
