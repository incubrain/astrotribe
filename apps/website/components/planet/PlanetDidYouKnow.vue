<!-- components/planet/PlanetDidYouKnow.vue -->
<script setup lang="ts">
// 1. Imports
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'

// 2. Component Options
defineOptions({
  name: 'PlanetDidYouKnow',
})

// 3. Props and Emits
const props = defineProps<{
  facts: string[]
  autoRotate?: boolean
  rotationInterval?: number
}>()

// 4. Reactive Variables
const currentIndex = ref(0)
const isTransitioning = ref(false)
const touchStartX = ref(0)
const touchEndX = ref(0)
let rotationTimer: number | null = null

// 5. Methods
const setFact = (index: number) => {
  if (isTransitioning.value || index === currentIndex.value) return

  isTransitioning.value = true
  currentIndex.value = index

  // Reset transition state after animation completes
  setTimeout(() => {
    isTransitioning.value = false
  }, 700) // Match the CSS transition duration
}

const nextFact = () => {
  if (isTransitioning.value || !props.facts.length) return

  const maxIndex = props.facts.length - 1
  const nextIndex = currentIndex.value >= maxIndex ? 0 : currentIndex.value + 1
  setFact(nextIndex)
}

const prevFact = () => {
  if (isTransitioning.value || !props.facts.length) return

  const maxIndex = props.facts.length - 1
  const prevIndex = currentIndex.value <= 0 ? maxIndex : currentIndex.value - 1
  setFact(prevIndex)
}

const startRotation = () => {
  if (!props.autoRotate || !props.facts.length) return

  // Clear any existing timer
  stopRotation()

  // Start a new rotation
  rotationTimer = window.setInterval(() => {
    nextFact()
  }, props.rotationInterval || 8000)
}

const stopRotation = () => {
  if (rotationTimer) {
    clearInterval(rotationTimer)
    rotationTimer = null
  }
}

// Touch event handlers for swipe support
const handleTouchStart = (e: TouchEvent) => {
  touchStartX.value = e.changedTouches[0].screenX
}

const handleTouchEnd = (e: TouchEvent) => {
  touchEndX.value = e.changedTouches[0].screenX
  handleSwipe()
}

const handleSwipe = () => {
  // Detect horizontal swipe with minimum threshold
  const swipeThreshold = 50
  const swipeDistance = touchEndX.value - touchStartX.value

  if (Math.abs(swipeDistance) > swipeThreshold) {
    if (swipeDistance > 0) {
      prevFact() // Swipe right, go to previous
    } else {
      nextFact() // Swipe left, go to next
    }
  }
}

// Keyboard navigation
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'ArrowRight') {
    nextFact()
  } else if (e.key === 'ArrowLeft') {
    prevFact()
  }
}

// 6. Lifecycle Hooks
onMounted(() => {
  startRotation()

  // Add keyboard event listeners for accessibility
  window.addEventListener('keydown', handleKeyDown)
})

// Watch for changes to facts array and restart rotation
watch(
  () => props.facts,
  () => {
    // Reset index if it's out of bounds with the new facts array
    if (currentIndex.value >= props.facts.length) {
      currentIndex.value = 0
    }
    startRotation()
  },
)

// Clean up on component unmount
onBeforeUnmount(() => {
  stopRotation()
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    class="bg-primary-900/30 backdrop-blur-sm rounded-lg p-8 border border-primary-800/30 relative overflow-hidden"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <!-- Background pattern for visual interest -->
    <div class="absolute inset-0 opacity-5">
      <div
        class="absolute inset-0 bg-repeat opacity-30"
        style="
          background-image: url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjIiIGZpbGw9IndoaXRlIi8+PC9zdmc+');
        "
      ></div>
    </div>

    <!-- Title with icon -->
    <div class="flex items-center mb-8 relative z-10">
      <div class="w-8 h-8 rounded-full bg-primary-600/20 flex items-center justify-center mr-3">
        <span class="text-xl">💡</span>
      </div>
      <h2 class="text-2xl font-bold text-primary-400">Did You Know?</h2>
    </div>

    <!-- Carousel content -->
    <div
      v-if="facts.length > 0"
      class="relative overflow-hidden h-32 z-10"
    >
      <transition-group
        name="fact-carousel"
        tag="div"
        class="absolute inset-0"
      >
        <p
          v-for="(fact, index) in facts"
          :key="index"
          class="text-lg absolute inset-0 transition-all duration-700 flex items-center p-2"
          :class="
            index === currentIndex ? 'opacity-100 transform-none' : 'opacity-0 translate-y-full'
          "
        >
          {{ fact }}
        </p>
      </transition-group>
    </div>
    <div
      v-else
      class="text-center py-4 relative z-10"
    >
      <p class="text-gray-400">No interesting facts available for this planet yet.</p>
    </div>

    <!-- Navigation controls -->
    <div class="flex justify-between items-center mt-8 relative z-10">
      <!-- Left/Right arrow buttons -->
      <button
        v-if="facts.length > 1"
        class="w-8 h-8 rounded-full bg-primary-800/60 flex items-center justify-center hover:bg-primary-700/60 transition-colors"
        aria-label="Previous fact"
        @click="prevFact"
      >
        <span class="transform rotate-180">➔</span>
      </button>

      <!-- Indicator dots -->
      <div
        v-if="facts.length > 1"
        class="flex gap-2"
      >
        <button
          v-for="(_, index) in facts"
          :key="index"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="
            index === currentIndex
              ? 'bg-primary-400 scale-110'
              : 'bg-primary-800 opacity-70 hover:opacity-100'
          "
          :aria-label="`Go to fact ${index + 1}`"
          :aria-current="index === currentIndex ? 'true' : 'false'"
          @click="setFact(index)"
        ></button>
      </div>

      <!-- Right arrow button -->
      <button
        v-if="facts.length > 1"
        class="w-8 h-8 rounded-full bg-primary-800/60 flex items-center justify-center hover:bg-primary-700/60 transition-colors"
        aria-label="Next fact"
        @click="nextFact"
      >
        <span>➔</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.fact-carousel-enter-active,
.fact-carousel-leave-active {
  transition: all 0.7s cubic-bezier(0.4, 0, 0.2, 1);
}

.fact-carousel-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fact-carousel-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}

/* Add subtle hover effect to navigation dots */
button.rounded-full {
  transition: all 0.2s ease;
}

button.rounded-full:hover {
  transform: scale(1.2);
}
</style>
