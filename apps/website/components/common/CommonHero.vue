<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useScroll } from '@vueuse/core'
import { useAnimation } from '~/composables/useAnimation'

const props = defineProps<{
  title: TitleType
  img: ImageType
  position: string
  fit?: string
}>()

const { conf } = useAnimation()

const heroRef = ref<HTMLElement | null>(null)
const scrollY = ref(0)

// Use scroll listener manually to avoid `useScroll` race with null refs
const updateScroll = () => {
  if (!heroRef.value) return
  const rect = heroRef.value.getBoundingClientRect()
  scrollY.value = -rect.top // or window.scrollY if full page
}

let ticking = false
const onScroll = () => {
  if (!ticking) {
    requestAnimationFrame(() => {
      updateScroll()
      ticking = false
    })
    ticking = true
  }
}

onMounted(() => {
  updateScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})

const backgroundTransform = computed(() => {
  if (!heroRef.value) return {}
  const height = heroRef.value.offsetHeight || 1
  return {
    transform: `scale(${1 + (scrollY.value / height) * 0.1}) translateY(${scrollY.value * 0.3}px)`,
  }
})

const contentTransform = computed(() => {
  if (!heroRef.value) return {}
  const height = heroRef.value.offsetHeight || 1
  return {
    transform: `translateY(${-scrollY.value * 0.2}px)`,
    opacity: Math.max(0, 1 - scrollY.value / (height * 0.7)),
  }
})

const overlayOpacity = computed(() => {
  if (!heroRef.value) return {}
  const height = heroRef.value.offsetHeight || 1
  return {
    opacity: Math.min(0.7, 0.5 + scrollY.value / (height * 2)),
  }
})
</script>

<template>
  <div
    ref="heroRef"
    class="relative h-screen w-full overflow-hidden"
  >
    <!-- Background Image -->
    <div
      class="absolute inset-0 z-0 will-change-transform transition-transform duration-300 ease-out"
      :style="backgroundTransform"
    >
      <IBImage
        :img="props.img"
        :class="`w-full h-full object-${props.position || 'center'} object-${props.fit || 'cover'}`"
      />
    </div>

    <!-- Overlay -->
    <div
      class="absolute inset-0 z-10 bg-black/40 transition-opacity duration-300"
      :style="overlayOpacity"
    />

    <!-- Content -->
    <div
      class="relative z-20 flex h-full flex-col items-center justify-center px-6 text-white will-change-transform transition-all duration-300"
      :style="contentTransform"
    >
      <h1 class="text-3xl lg:text-5xl font-bold text-center">
        {{ props.title.main }}
      </h1>
      <p
        v-if="props.title.subtitle"
        class="mt-4 text-lg lg:text-2xl text-center"
      >
        {{ props.title.subtitle }}
      </p>

      <div class="mt-8">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
