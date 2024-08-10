<script setup lang="ts">
const emit = defineEmits(['update:scrollEnd'])
const scrollContainer = ref(null)
const observer = ref(null as IntersectionObserver | null)

onMounted(() => {
  observer.value = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        emit('update:scrollEnd')
      }
    },
    {
      root: null,
      threshold: 1
    }
  )

  if (scrollContainer.value) {
    observer.value.observe(scrollContainer.value)
  }
})

onUnmounted(() => {
  if (scrollContainer.value) {
    observer.value?.unobserve(scrollContainer.value)
  }
})
</script>

<template>
  <div>
    <slot />
    <div ref="scrollContainer" />
  </div>
</template>
<style></style>
