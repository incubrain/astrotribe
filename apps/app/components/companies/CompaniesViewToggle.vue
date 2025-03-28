<script setup lang="ts">
interface Props {
  modelValue: 'grid' | 'list'
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: 'grid' | 'list'): void
}>()

const toggleView = () => {
  const newView = props.modelValue === 'grid' ? 'list' : 'grid'
  emit('update:modelValue', newView)
}
</script>

<template>
  <button
    class="p-2 rounded-lg bg-primary-900/50 border border-primary-800/30 hover:bg-primary-800/50 transition-colors"
    :title="modelValue === 'grid' ? 'Switch to list view' : 'Switch to grid view'"
    @click="toggleView"
  >
    <Icon
      :name="modelValue === 'grid' ? 'mdi:view-grid' : 'mdi:view-list'"
      class="w-5 h-5 text-primary-300"
    />
  </button>
</template>
