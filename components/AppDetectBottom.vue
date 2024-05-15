<template>
  <div ref="sentinel" />
</template>

<script setup lang="ts">
const sentinel = ref<HTMLElement | null>(null)

const emit = defineEmits(['bottom-trigger'])

watchEffect((onCleanup) => {
  if (!sentinel.value) {
    // The sentinel element is not yet in the DOM.
    return
  }

  const options = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        console.info('intersecting')
        emit('bottom-trigger')
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
