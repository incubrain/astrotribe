<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { gsap } from 'gsap'

onMounted(() => {
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
})

const titles = ['News', 'Research', 'Companies', 'For All']
const currentTitleIndex = ref(0)
const displayedText = ref('')
const isDeleting = ref(false)

const typingSpeed = 150
const deletingSpeed = 75
const pauseBetweenWords = 1500

const backgroundImages = ['/defaults/cover.jpg', '/defaults/cover.jpg', '/defaults/cover.jpg']

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

onMounted(() => {
  typeText()
})
</script>

<template>
  <div class="relative w-screen h-screen overflow-hidden">
    <LandingImageCycle
      :images="backgroundImages"
      :interval="7000"
    />

    <!-- Black Overlay -->
    <div class="absolute inset-0 bg-black bg-opacity-40"></div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col items-center justify-center h-full text-white">
      <!-- Animated Title -->
      <h1 class="text-5xl md:text-8xl font-bold text-center mb-8 flex justify-center gap-4">
        <span class="block font-space text-glow text-3d">Space</span>
        <span class="inline-block min-w-[8ch] text-left text-glow text-3d">
          <span class="typed-text">{{ displayedText }}</span
          ><span class="inline-block w-[2px] h-[1em] bg-white align-middle animate-blink"></span>
        </span>
      </h1>

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

.typed-text {
  background: linear-gradient(45deg, #4facfe 0%, #00f2fe 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
