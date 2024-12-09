<!-- components/AdVisibilityWrapper.vue -->
<script setup lang="ts">
const props = defineProps<{
  variantId: string
  threshold?: number
}>()

const { isVisible, startTime, onVisibilityChange } = useAdsEvents()
const elementRef = ref<HTMLElement | null>(null)
const { trackInteraction } = useAdsStore()

console.log('Observer', isVisible)

const slotProps = computed(() => ({
  isVisible: isVisible.value,
  startTime: startTime.value,
}))

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        onVisibilityChange(entry.isIntersecting, props.variantId, trackInteraction)
      })
    },
    {
      threshold: props.threshold ?? 0.5,
    },
  )

  if (elementRef.value) {
    observer.observe(elementRef.value)
  }

  onBeforeUnmount(() => {
    if (elementRef.value) {
      observer.unobserve(elementRef.value)
    }
  })
})
</script>

<template>
  <div ref="elementRef">
    <slot v-bind="slotProps" />
  </div>
</template>
