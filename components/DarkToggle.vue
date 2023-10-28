<template>
  <div class="flex">
    <slot v-bind="context" />
  </div>
</template>

<script setup lang="ts">
const mode = useColorMode()

const isDark = computed<boolean>({
  get() {
    return mode.value === 'dark'
  },
  set() {
    mode.preference = isDark.value ? 'light' : 'dark'
  }
})

const isAppearanceTransition =
  typeof document !== 'undefined' &&
  // @ts-expect-error: Transition API
  document.startViewTransition &&
  !window.matchMedia('(prefers-reduced-motion: reduce)').matches

function toggle(event?: MouseEvent) {
  if (!isAppearanceTransition || !event) {
    isDark.value = !isDark.value
    return
  }

  const x = event.clientX
  const y = event.clientY
  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
  // @ts-expect-error: Transition API
  const transition = document.startViewTransition(async () => {
    isDark.value = !isDark.value
    await nextTick()
    console.log('nextTick', isDark.value)
  })

  transition.ready.then(() => {
    const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`]
    console.log('clipPath', clipPath, isDark.value)
    document.documentElement.animate(
      {
        clipPath: isDark.value ? clipPath.reverse() : clipPath
      },
      {
        duration: 400,
        easing: 'ease-in',
        pseudoElement: isDark.value ? '::view-transition-old(root)' : '::view-transition-new(root)'
      }
    )
  })
}

const context = reactive({
  mode,
  isDark,
  toggle
})

useHead({
  meta: [
    {
      id: 'theme-color',
      name: 'theme-color'
    }
  ]
})
</script>

<style scoped></style>
