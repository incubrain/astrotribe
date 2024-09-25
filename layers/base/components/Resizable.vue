<script lang="ts" setup>
const props = defineProps<{
  slots: Record<string, string>
}>()

const container = ref<HTMLElement | null>(null)
const resizer = ref<HTMLElement | null>(null)
const sizes = ref<number[]>([1, 1])

const startResize = (e: MouseEvent) => {
  e.preventDefault()
  window.addEventListener('mousemove', resize)
  window.addEventListener('mouseup', stopResize)
}

const resize = (e: MouseEvent) => {
  if (!container.value) return
  const containerRect = container.value.getBoundingClientRect()
  const newLeftWidth = e.clientX - containerRect.left
  const containerWidth = containerRect.width

  sizes.value = [newLeftWidth / containerWidth, 1 - newLeftWidth / containerWidth]
}

const stopResize = () => {
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResize)
}

onMounted(() => {
  if (resizer.value) {
    resizer.value.addEventListener('mousedown', startResize)
  }
})

onUnmounted(() => {
  if (resizer.value) {
    resizer.value.removeEventListener('mousedown', startResize)
  }
  window.removeEventListener('mousemove', resize)
  window.removeEventListener('mouseup', stopResize)
})
</script>

<template>
  <div
    ref="container"
    class="relative flex h-full w-full"
  >
    <div
      v-for="(componentId, index) in Object.values(slots)"
      :key="componentId"
      :class="['overflow-auto', index === 0 ? 'pr-4' : 'pl-4']"
      :style="{ flex: sizes[index] }"
    >
      <slot :name="componentId"></slot>
    </div>
    <div
      ref="resizer"
      class="w-2 cursor-col-resize bg-gray-200 hover:bg-gray-300"
      @mousedown="startResize"
    ></div>
  </div>
</template>

<style scoped>
/* Add any additional styles here */
</style>
