<!-- components/admin/table/form/field/BooleanField.vue -->
<template>
  <div>
    <PrimeCheckbox
      v-model="localValue"
      :binary="true"
      :class="{ 'p-invalid': error }"
    />
    <label class="ml-2 text-sm">{{ field.column_name }}</label>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: boolean | null
  field: any
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean | null]
}>()

const localValue = computed({
  get: () => props.modelValue ?? false,
  set: (value) => emit('update:modelValue', value),
})
</script>
