<!-- components/AdsVisibilityWrapper.vue -->
<template>
  <div
    ref="elementRef"
    class="visibility-wrapper"
  >
    <slot
      v-if="isEnabled"
      :is-visible="isVisible"
      :start-time="startTime"
    ></slot>
    <div
      v-else
      class="bg-slate-950 rounded-lg border border-yellow-800 p-4 text-center"
    >
      <p>Advertisement content unavailable</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

interface Props {
  variantId: string
  threshold?: number
}

const props = defineProps<Props>()

// Add defensive coding to handle missing data
const isEnabled = computed(() => {
  return !!props.variantId
})

const elementRef = ref(null)
const isVisible = ref(false)
const startTime = ref(Date.now())

const { stop } = useIntersectionObserver(
  elementRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting && !isVisible.value) {
      isVisible.value = true
      startTime.value = Date.now()
    } else if (!isIntersecting && isVisible.value) {
      isVisible.value = false
    }
  },
  { threshold: props.threshold || 0.5 },
)

onUnmounted(() => {
  stop()
})
</script>

<style scoped>
.visibility-wrapper {
  width: 100%;
  height: 100%;
}
</style>
