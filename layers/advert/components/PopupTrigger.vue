<!-- components/PopupTrigger.vue -->
<script setup lang="ts">
const isPopupMounted = ref(true)


// Handle exit intent
// const handleExitIntent = (e: MouseEvent) => {
//   if (e.clientY <= 0 && settings?.trigger === 'exit-intent') {
//     isPopupMounted.value = true
//   }
// }

// Handle scroll trigger
// const handleScroll = useDebounceFn(() => {
//   if (settings?.trigger === 'scroll') {
//     const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
//     if (scrollPercent >= 50) {
//       // Show after 50% scroll
//       isPopupMounted.value = true
//     }
//   }
// }, 100)

// onMounted(
//   () => {
//     if (settings?.trigger === 'immediate') {
//       isPopupMounted.value = true
//     } else if (settings?.trigger === 'exit-intent') {
//       document.addEventListener('mouseleave', handleExitIntent)
//     } else if (settings?.trigger === 'scroll') {
//       window.addEventListener('scroll', handleScroll)
//     }
//   },
//   { immediate: true },
// )

// onBeforeUnmount(() => {
//   document.removeEventListener('mouseleave', handleExitIntent)
//   window.removeEventListener('scroll', handleScroll)
// })
</script>

<template>
  <AdsPopupContainer v-if="isPopupMounted" />
</template>
