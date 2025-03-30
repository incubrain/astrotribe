<script setup lang="ts">
// 1. Imports
import { ref, onMounted, watch } from 'vue'

// 2. Component Options
defineOptions({
  name: 'DidYouKnowCarousel',
})

// 3. Props and Emits
const props = defineProps<{
  facts: string[]
  autoRotate?: boolean
  rotationInterval?: number
}>()

// 4. Reactive Variables
const currentIndex = ref(0)
let rotationTimer: any = null

// 5. Methods
const setFact = (index: number) => {
  currentIndex.value = index
}

const startRotation = () => {
  if (!props.autoRotate || !props.facts.length) return

  // Clear any existing timer
  if (rotationTimer) {
    clearInterval(rotationTimer)
  }

  // Start a new rotation
  rotationTimer = setInterval(() => {
    const maxIndex = props.facts.length - 1
    currentIndex.value = currentIndex.value >= maxIndex ? 0 : currentIndex.value + 1
  }, props.rotationInterval || 8000)
}

// 6. Lifecycle Hooks
onMounted(() => {
  startRotation()
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

// Clean up interval on component unmount
onBeforeUnmount(() => {
  if (rotationTimer) {
    clearInterval(rotationTimer)
  }
})
</script>

<template>
  <div class="mb-16 bg-primary-900/30 backdrop-blur-sm rounded-lg p-6 border border-primary-800/30">
    <h2 class="text-2xl font-bold mb-6 text-primary-400">Did You Know?</h2>
    <div
      v-if="facts.length > 0"
      class="relative overflow-hidden h-24"
    >
      <transition-group
        name="fact-carousel"
        tag="div"
        class="absolute inset-0"
      >
        <p
          v-for="(fact, index) in facts"
          :key="index"
          class="text-lg absolute inset-0 transition-all duration-500 flex items-center"
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
      class="text-center py-4"
    >
      <p class="text-gray-400">No interesting facts available for this planet yet.</p>
    </div>
    <div
      v-if="facts.length > 1"
      class="flex justify-center mt-4"
    >
      <div class="flex gap-2">
        <button
          v-for="(_, index) in facts"
          :key="index"
          class="w-3 h-3 rounded-full transition-all duration-300"
          :class="index === currentIndex ? 'bg-primary-400' : 'bg-primary-800'"
          @click="setFact(index)"
        ></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fact-carousel-enter-active,
.fact-carousel-leave-active {
  transition: all 0.5s ease;
}

.fact-carousel-enter-from {
  opacity: 0;
  transform: translateY(30px);
}

.fact-carousel-leave-to {
  opacity: 0;
  transform: translateY(-30px);
}
</style>
