<template>
  <div ref="sentinel" />
</template>

<script setup lang="ts">
// Infinate Post Scroll
const sentinel = ref<HTMLElement | null>(null)

// Trigger emit when sentinel is in view
const emit = defineEmits(['infinate-trigger'])

watchEffect((onCleanup) => {
  if (!sentinel.value) {
    // The sentinel element is not yet in the DOM.
    return
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        emit('infinate-trigger')
      }
    })
  }, options)

  observer.observe(sentinel.value)

  // Remove Sentinel On UnMounted
  onCleanup(() => {
    if (observer && sentinel.value) {
      observer.unobserve(sentinel.value)
    }
  })
})
</script>

<style scoped></style>
