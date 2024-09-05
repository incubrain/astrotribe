<script setup lang="ts">
const enableHoverEffect = ref(false)
const hoverPosition = ref(null as null | 'up' | 'down') // 'up', 'center', or 'down'

function checkHoverPosition(event) {
  if (!enableHoverEffect.value) {
    return // Do nothing if hover effects are disabled
  }
  const rect = event.target.getBoundingClientRect()
  const halfScreen = window.innerHeight / 2
  if (rect.top < halfScreen) {
    console.log('top')
    // If the card is in the top third, expand downwards
    hoverPosition.value = 'down'
  }
  else {
    console.log('bottom')
    // If the card is in the bottom third, expand upwards
    hoverPosition.value = 'up'
  }
}

const checkScreenSize = () => {
  enableHoverEffect.value = window.innerWidth >= 1024 // Tailwind's 'lg' breakpoint
}

const paddingSize = computed(() => (window.innerWidth >= 1280 ? 32 : 16))

onMounted(() => {
  window.addEventListener('resize', checkScreenSize)
  checkScreenSize()
  return () => window.removeEventListener('resize', checkScreenSize)
})

// ui:med:easy:1 - if there is only one card in the grid row, we need to set min h of 100% to prevent the card from collapsing
</script>

<template>
  <div
    class="group relative hover:z-50"
    @mouseenter="checkHoverPosition"
    @mouseleave="hoverPosition = null"
  >
    <div
      :class="[
        'transition-all duration-300 delay-200 p-4 border-b-2 md:border border-color overflow-hidden background',
        'flex flex-col gap-4 w-full h-full md:rounded-md md:shadow-md',
        {
          'lg:group-hover:absolute': enableHoverEffect && !!hoverPosition,
          'top-0': enableHoverEffect && hoverPosition === 'down',
          'bottom-0': enableHoverEffect && hoverPosition === 'up',
        },
      ]"
      :style="{
        height: enableHoverEffect && !!hoverPosition ? `calc(200% + ${paddingSize}px)` : '100%',
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
/* Extra styles if needed */
</style>
