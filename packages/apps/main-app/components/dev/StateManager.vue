<template>
  <div class="state-manager">
    <h3>State</h3>
    <div
      v-for="(value, key) in state"
      :key="key"
    >
      <label>{{ key }}</label>
      <input
        :value="value"
        @input="updateState(key, $event.target.value)"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  state: Record<string, any>
}>()

const emit = defineEmits<{
  (e: 'update:state', state: Record<string, any>): void
}>()

const updateState = (key: string, value: any) => {
  emit('update:state', { ...props.state, [key]: value })
}
</script>
