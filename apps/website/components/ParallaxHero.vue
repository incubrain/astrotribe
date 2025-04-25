<script setup lang="ts">
import { useScroll } from '@vueuse/core'

const props = defineProps<{
  title: TitleType
  img: ImageType
  position: string
}>()

// Parallax effect values
const heroRef = ref<HTMLElement | null>(null)
const contentRef = ref<HTMLElement | null>(null)
const backgroundRef = ref<HTMLElement | null>(null)
const overlayRef = ref<HTMLElement | null>(null)

// Get scroll position using VueUse
const { y: scrollY } = useScroll(heroRef)

// Calculate parallax transformations based on scroll position
const backgroundTransform = computed(() => {
  if (!heroRef.value) return {}

  // Scale larger at the beginning and zoom out as we scroll
  const scale = Math.max(1, 1 + (scrollY.value / heroRef.value.offsetHeight) * 0.15)

  // Move background slower than foreground for parallax effect
  const translateY = scrollY.value * 0.4

  return {
    transform: `scale(${scale}) translateY(${translateY}px)`,
    filter: `brightness(${Math.max(0.5, 1 - scrollY.value / (heroRef.value.offsetHeight * 1.5))})`,
  }
})

// Animate text content to move faster than background
const contentTransform = computed(() => {
  if (!heroRef.value) return {}

  const translateY = -scrollY.value * 0.2
  const opacity = Math.max(0, 1 - scrollY.value / (heroRef.value.offsetHeight * 0.7))

  return {
    transform: `translateY(${translateY}px)`,
    opacity,
  }
})

// Animate overlay to become more opaque as we scroll
const overlayTransform = computed(() => {
  if (!heroRef.value) return {}

  // Start with the base opacity and increase it as we scroll
  const opacity = Math.min(0.7, 0.5 + scrollY.value / (heroRef.value.offsetHeight * 2))

  return {
    opacity,
  }
})

// Get animation constants
const { conf } = useAnimation()

// Handle scroll performance optimization with requestAnimationFrame
let ticking = false
const handleScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      ticking = false
    })
    ticking = true
  }
}

// Add scroll event listener
onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('scroll', handleScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (import.meta.client) {
    window.removeEventListener('scroll', handleScroll)
  }
})
</script>

<template>
  <div
    ref="heroRef"
    class="relative flex h-screen w-full items-center justify-center overflow-hidden"
  >
    <!-- Background image with parallax effect -->
    <div
      ref="backgroundRef"
      class="absolute inset-0 z-0 transition-transform duration-300 ease-out will-change-transform"
      :style="backgroundTransform"
    >
      <IBImage
        :img="{
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
        }"
        :class="`w-full h-full object-${props.position || 'center'} object-${props.fit || 'cover'}`"
      />
    </div>

    <!-- Overlay with dynamic opacity -->
    <div
      ref="overlayRef"
      class="absolute inset-0 z-10 bg-gradient-to-b from-primary-950/70 to-primary-900/80 transition-opacity duration-300"
      :style="overlayTransform"
    ></div>

    <!-- Floating elements (stars) for space theme -->
    <div class="absolute inset-0 z-20 overflow-hidden pointer-events-none">
      <div
        v-for="i in 15"
        :key="`star-${i}`"
        class="absolute rounded-full bg-white opacity-30"
        :style="{
          width: `${Math.random() * 4 + 2}px`,
          height: `${Math.random() * 4 + 2}px`,
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          animation: `twinkle ${Math.random() * 4 + 3}s ease-in-out infinite ${Math.random() * 5}s`,
        }"
      ></div>
    </div>

    <!-- Content with text and slot -->
    <div
      ref="contentRef"
      class="relative z-30 flex flex-col items-center justify-center w-full px-4 transition-all duration-300 will-change-transform"
      :style="contentTransform"
    >
      <div
        class="flex flex-col md:flex-row items-center justify-center gap-8 lg:gap-16 max-w-7xl w-full"
      >
        <!-- Default slot (left side) -->
        <div
          v-motion
          :initial="conf.fadeUp.initial"
          :enter="conf.fadeUp.enter"
          class="flex flex-col gap-4 pb-6 md:w-1/3"
        >
          <slot />
        </div>

        <!-- Title and subtitle (right side) -->
        <div
          v-motion
          :initial="conf.fadeUp.initial"
          :enter="{
            ...conf.fadeUp.enter,
            transition: { ...conf.fadeUp.enter.transition, delay: 0.2 },
          }"
          class="flex flex-col gap-4 md:w-2/3"
        >
          <h2
            :class="`backdrop-blur-sm bg-primary-950/30 border border-primary-800/30 px-6 py-4 rounded-lg text-3xl font-bold shadow-xl lg:text-5xl text-${title.centered ? 'center' : 'left'}`"
          >
            {{ title.main }}
          </h2>
          <p
            v-if="title.subtitle"
            :class="`backdrop-blur-sm bg-primary-900/20 border border-primary-800/20 inline-block w-auto max-w-2xl rounded-lg px-6 py-4 text-xl font-semibold lg:text-2xl text-${title.centered ? 'center' : 'left'}`"
          >
            {{ title.subtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Actions slot positioned at the bottom -->
    <div
      v-if="$slots.actions"
      v-motion
      :initial="conf.fadeUp.initial"
      :enter="{ ...conf.fadeUp.enter, transition: { ...conf.fadeUp.enter.transition, delay: 0.4 } }"
      class="absolute bottom-8 left-0 right-0 z-30 flex justify-center"
    >
      <div
        class="backdrop-blur-sm bg-primary-900/30 rounded-lg border border-primary-800/30 px-6 py-3"
      >
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes twinkle {
  0%,
  100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.3);
  }
}

.will-change-transform {
  will-change: transform;
}
</style>
