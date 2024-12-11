<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core'

interface Props {
  threshold?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 200,
  disabled: false,
})

const emit = defineEmits<{
  'update:scrollEnd': []
}>()

const triggerElement = ref<HTMLElement | null>(null) // Changed ref name to be more descriptive
const observer = ref<IntersectionObserver | null>(null)
const isLoading = ref(false)

const triggerLoad = useDebounceFn(() => {
  console.log('📜 triggerLoad called - Loading:', isLoading.value, 'Disabled:', props.disabled)
  if (!isLoading.value && !props.disabled) {
    console.log('📜 Triggering load...')
    isLoading.value = true
    emit('update:scrollEnd')
    setTimeout(() => {
      console.log('📜 Reset loading state')
      isLoading.value = false
    }, 300)
  }
}, 100)

onMounted(() => {
  console.log('📜 Component mounted, threshold:', props.threshold)
  console.log('📜 Trigger element ref:', triggerElement.value)

  if ('IntersectionObserver' in window) {
    console.log('📜 Using IntersectionObserver')
    observer.value = new IntersectionObserver(
      (entries) => {
        console.log('📜 IntersectionObserver callback', {
          isIntersecting: entries[0].isIntersecting,
          intersectionRatio: entries[0].intersectionRatio,
          boundingClientRect: entries[0].boundingClientRect,
        })

        if (entries[0].isIntersecting) {
          console.log('📜 Intersection detected!')
          triggerLoad()
        }
      },
      {
        root: null,
        threshold: 0,
      },
    )

    if (triggerElement.value) {
      console.log('📜 Starting observation of trigger element')
      observer.value.observe(triggerElement.value)
    } else {
      console.warn('📜 No trigger element found to observe!')
    }
  }
})

onUnmounted(() => {
  console.log('📜 Component unmounting, cleaning up observers')
  if (observer.value && triggerElement.value) {
    observer.value.unobserve(triggerElement.value)
  }
})

// Watch for changes to the trigger element
watch(triggerElement, (newVal) => {
  console.log('📜 Trigger element ref changed:', newVal)
})
</script>

<template>
  <div class="infinite-scroll-container">
    <slot />
    <div class="relative h-10">
      <div
        ref="triggerElement"
        class="absolute inset-0 z-50 w-full h-32"
        :style="`margin-top: -${props.threshold}px`"
      />
    </div>
  </div>
</template>
