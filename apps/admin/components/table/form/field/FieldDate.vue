<!-- components/admin/table/form/field/DateField.vue -->
<template>
  <PrimeDatePicker
    v-model="localValue"
    :show-time="showTime"
    :show-icon="true"
    :placeholder="placeholder"
    :class="['w-full', { 'p-invalid': error }]"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: Date | null
  field: any
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Date | null]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const showTime = computed(
  () => props.field.data_type === 'timestamp' || props.field.data_type === 'timestamptz',
)

const placeholder = computed(() => `Select ${props.field.column_name}`)
</script>
