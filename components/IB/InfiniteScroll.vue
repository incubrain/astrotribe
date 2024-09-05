<script setup lang="ts">
const emit = defineEmits(['update:scrollEnd'])
const scrollContainer = ref<HTMLElement | null>(null)
const observer = ref<IntersectionObserver | null>(null)

onMounted(() => {
  if ('IntersectionObserver' in window) {
    observer.value = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          emit('update:scrollEnd')
        }
      },
      {
        root: null,
        rootMargin: '200px', // Load more content when within 200px of the bottom
        threshold: 0.1, // Trigger when at least 10% of the target is visible
      },
    )

    if (scrollContainer.value) {
      observer.value.observe(scrollContainer.value)
    }
  }
  else {
    // Fallback for browsers that don't support IntersectionObserver
    window.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  if (observer.value && scrollContainer.value) {
    observer.value.unobserve(scrollContainer.value)
  }
  window.removeEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  if (scrollContainer.value) {
    const rect = scrollContainer.value.getBoundingClientRect()
    if (rect.top <= window.innerHeight) {
      emit('update:scrollEnd')
    }
  }
}
</script>

<template>
  <div>
    <slot />
    <div
      ref="scrollContainer"
      class="h-10 bg-transparent"
      aria-hidden="true"
    />
  </div>
</template>
