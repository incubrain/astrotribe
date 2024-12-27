<!-- components/admin/table/form/field/TextField.vue -->
<template>
  <PrimeInputText
    v-model="localValue"
    :maxlength="field.character_maximum_length"
    :placeholder="placeholder"
    :class="['w-full', { 'p-invalid': error }]"
  />
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: string | null
  field: any
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string | null]
}>()

const localValue = computed({
  get: () => props.modelValue ?? '',
  set: (value) => emit('update:modelValue', value || null),
})

const placeholder = computed(() => `Enter ${props.field.column_name}`)
</script>
