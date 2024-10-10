<template>
  <div class="props-editor">
    <h3>Props</h3>
    <div
      v-for="(value, key) in props"
      :key="key"
    >
      <label>{{ key }}</label>
      <input
        :value="value"
        :type="getInputType(value)"
        @input="updateProp(key, $event.target.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  props: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:props', props: Record<string, any>): void
}>()

const updateProp = (key: string, value: any) => {
  emit('update:props', { ...props.props, [key]: value })
}

const getInputType = (value: any) => {
  switch (typeof value) {
    case 'number':
      return 'number'
    case 'boolean':
      return 'checkbox'
    default:
      return 'text'
  }
}
</script>
