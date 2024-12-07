<!-- components/admin/table/form/field/EnumField.vue -->
<template>
  <PrimeSelect
    v-model="localValue"
    :options="enumOptions"
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
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// Extract enum values from field metadata
const enumOptions = computed(() => {
  // Parse enum values from field.constraints
  // Example format: ARRAY['value1'::text, 'value2'::text]
  const enumConstraint = props.field.constraints?.find(
    (c: any) => c.constraint_type === 'CHECK' && c.check_clause.includes('ANY'),
  )

  if (!enumConstraint) return []

  const match = enumConstraint.check_clause.match(/ARRAY\[(.*?)\]/)
  if (!match) return []

  return match[1].split(',').map((value) =>
    value
      .trim()
      .replace(/'/g, '')
      .replace(/::text/g, ''),
  )
})

const placeholder = computed(() => `Select ${props.field.column_name}`)
</script>
