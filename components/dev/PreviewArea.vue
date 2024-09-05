<!-- PreviewArea.vue -->
<template>
  <div class="preview-area">
    <component
      :is="component"
      v-bind="props"
      v-on="eventHandlers"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  component: any
  props: Record<string, any>
  state: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'event', eventName: string, eventData: any): void
}>()

const eventHandlers = computed(() => {
  return Object.keys(props.component.emits || {}).reduce(
    (acc, eventName) => {
      acc[eventName] = (eventData: any) => emit('event', eventName, eventData)
      return acc
    },
    {} as Record<string, (eventData: any) => void>
  )
})
</script>

<style scoped>
.preview-area {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: auto;
}
</style>
