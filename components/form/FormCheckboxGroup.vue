<template>
  <div class="flex flex-wrap justify-center">
    <div
      v-for="(option, index) in options"
      :key="index"
      class="flex flex-col items-center justify-center m-2 transition-colors ease-linear border cursor-pointer w-36 h-36 border-color rounded-2xl shadow-soft-xl"
      :class="{ 'bg-primary-500 text-white': isSelected(option.value) }"
      @click="toggleSelection(option.value)"
    >
      <UIcon
        v-show="option.icon"
        :name="option.icon"
        class="w-16 h-16"
      />
      <span class="mt-2 text-sm">{{ option.label }}</span>
      <VField
        class="hidden"
        :type="type"
        :name="name"
        :value="option.value"
        :checked="isSelected(option.value)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CheckboxOptionForm } from '@/types/forms'

const emit = defineEmits(['update:modelValue'])

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => []
  },
  options: {
    type: Array<CheckboxOptionForm>,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'checkbox'
  }
})

const isSelected = (value) => props.modelValue.includes(value)

const toggleSelection = (value: string) => {
  const newModelValue = [...props.modelValue]
  const index = newModelValue.indexOf(value)

  if (index >= 0) {
    newModelValue.splice(index, 1)
  } else {
    newModelValue.push(value)
  }

  emit('update:modelValue', newModelValue)
}
</script>

<style scoped>
/* Add your styles here */
</style>
