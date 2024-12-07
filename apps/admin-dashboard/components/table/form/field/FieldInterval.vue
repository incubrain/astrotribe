<!-- components/admin/table/form/field/IntervalField.vue -->
<template>
  <div class="flex gap-2">
    <PrimeInputNumber
      v-model="value"
      :class="['w-full', { 'p-invalid': error }]"
      :placeholder="placeholder"
    />
    <PrimeSelect
      v-model="unit"
      :options="intervalUnits"
      class="w-40"
      @change="updateInterval"
    />
  </div>
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

const value = ref<number | null>(null)
const unit = ref('days')

const intervalUnits = ['years', 'months', 'weeks', 'days', 'hours', 'minutes', 'seconds']

const parseInterval = (interval: string | null) => {
  if (!interval) return { value: null, unit: 'days' }

  const match = interval.match(/(\d+)\s+(\w+)/)
  if (!match) return { value: null, unit: 'days' }

  return {
    value: parseInt(match[1]),
    unit: match[2].toLowerCase(),
  }
}

const updateInterval = () => {
  if (value.value === null) {
    emit('update:modelValue', null)
    return
  }
  emit('update:modelValue', `${value.value} ${unit.value}`)
}

const placeholder = computed(() => `Enter ${props.field.column_name}`)

watch(
  () => props.modelValue,
  (newValue) => {
    const parsed = parseInterval(newValue)
    value.value = parsed.value
    unit.value = parsed.unit
  },
  { immediate: true },
)
</script>
