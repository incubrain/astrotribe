<!-- components/admin/table/form/field/FieldNumber.vue -->
<template>
  <PrimeInputNumber
    v-model="localValue"
    :placeholder="placeholder"
    :class="['w-full', { 'p-invalid': !!error }]"
    :min="minValue"
    :max="maxValue"
    :mode="mode"
    :decimals="decimals"
    :step="step"
    :show-buttons="false"
    :use-grouping="useGrouping"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: number | null
  field: {
    column_name: string
    data_type: string
    numeric_precision?: number
    numeric_scale?: number
    constraints?: Array<{
      constraint_type: string
      check_clause?: string
    }>
  }
  error?: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const logger = useLogger('admin')

// Handle conversion between string and number, maintaining null values
const localValue = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value)
  },
})

// Determine if we should show decimals based on data type
const mode = computed(() => {
  switch (props.field.data_type) {
    case 'numeric':
    case 'decimal':
      return 'decimal'
    default:
      return 'numeric'
  }
})

// Get decimal places from field metadata
const decimals = computed(() => {
  if (mode.value === 'decimal') {
    return props.field.numeric_scale ?? 0
  }
  return 0
})

// Parse min/max from check constraints
const parseConstraints = () => {
  const constraints = props.field.constraints || []
  let min = null
  let max = null

  constraints.forEach((constraint) => {
    if (constraint.constraint_type === 'CHECK' && constraint.check_clause) {
      // Match patterns like "column >= 0" or "column <= 100"
      const minMatch = constraint.check_clause.match(/(\w+)\s*>=\s*(-?\d+(?:\.\d+)?)/)
      const maxMatch = constraint.check_clause.match(/(\w+)\s*<=\s*(-?\d+(?:\.\d+)?)/)

      if (minMatch) min = parseFloat(minMatch[2])
      if (maxMatch) max = parseFloat(maxMatch[2])
    }
  })

  return { min, max }
}

const { min: minValue, max: maxValue } = parseConstraints()

// Determine step based on decimals
const step = computed(() => {
  if (decimals.value === 0) return 1
  return Math.pow(0.1, decimals.value)
})

// Use grouping for large numbers
const useGrouping = computed(() => {
  // Only use grouping for integers or numbers with few decimal places
  return decimals.value <= 2
})

const placeholder = computed(() => `Enter ${props.field.column_name}`)

// Log any constraint violations
watch(localValue, (newValue) => {
  if (newValue !== null) {
    if (minValue !== null && newValue < minValue) {
      logger.warn('Value below minimum:', {
        field: props.field.column_name,
        min: minValue,
        value: newValue,
      })
    }
    if (maxValue !== null && newValue > maxValue) {
      logger.warn('Value above maximum:', {
        field: props.field.column_name,
        max: maxValue,
        value: newValue,
      })
    }
  }
})
</script>

<style scoped>
.p-inputnumber {
  width: 100%;
}

.p-inputnumber-input {
  width: 100%;
}
</style>
