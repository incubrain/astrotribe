<template>
  <div
    ref="scrollContainer"
    :class="
      mobiBottomNav
        ? 'w-full h-[calc(100svh-var(--nav-height-sm)-var(--nav-height-mobi))] md:h-[calc(100svh-var(--nav-height-md)-var(--nav-height-mobi))] lg:h-[calc(100svh-var(--nav-height-lg))] relative overflow-y-scroll'
        : 'w-full h-[calc(100svh-var(--nav-height-sm))] md:h-[calc(100svh-var(--nav-height-md))] lg:h-[calc(100svh-var(--nav-height-lg))] relative overflow-y-scroll'
    "
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const scrollContainer = ref(null)

defineProps({
  mobiBottomNav: {
    type: Boolean as PropType<boolean>,
    default: false
  }
})

onMounted(() => {
  watch(route, () => {
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = 0
    }
  })
})
</script>

<style scoped></style>
