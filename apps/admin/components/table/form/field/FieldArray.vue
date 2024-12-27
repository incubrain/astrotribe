<!-- components/admin/table/form/field/ArrayField.vue -->
<template>
  <div class="flex flex-col gap-2">
    <PrimeChips
      v-if="simpleArray"
      v-model="localValue"
      :class="['w-full', { 'p-invalid': error }]"
      :placeholder="placeholder"
      :separator="separator"
      @update:model-value="handleUpdate"
    />
    <template v-else>
      <PrimeTextarea
        v-model="arrayString"
        :class="['w-full font-mono text-sm', { 'p-invalid': error || arrayError }]"
        :placeholder="placeholder"
        :auto-resize="true"
        rows="6"
        @update:model-value="validateAndUpdate"
      />
      <span
        v-if="arrayError"
        class="text-sm text-destructive"
      >
        Invalid array format
      </span>
    </template>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any[]
  field: any
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any[]]
}>()

const arrayString = ref('')
const arrayError = ref(false)
const localValue = ref<any[]>([])

// Determine if it's a simple array (strings or numbers)
const simpleArray = computed(() => {
  const elementType = props.field.data_type.replace('[]', '')
  return ['text', 'varchar', 'integer', 'bigint', 'smallint'].includes(elementType)
})

const separator = computed(() => {
  const elementType = props.field.data_type.replace('[]', '')
  return ['integer', 'bigint', 'smallint'].includes(elementType) ? ' ' : ','
})

const placeholder = computed(() => `Enter ${props.field.column_name} values`)

const validateAndUpdate = (value: string) => {
  try {
    const parsed = value ? JSON.parse(value) : []
    if (!Array.isArray(parsed)) throw new Error('Not an array')
    arrayError.value = false
    emit('update:modelValue', parsed)
  } catch (e) {
    arrayError.value = true
  }
}

const handleUpdate = (value: any[]) => {
  emit('update:modelValue', value)
}

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      if (simpleArray.value) {
        localValue.value = newValue || []
      } else {
        arrayString.value = newValue ? JSON.stringify(newValue, null, 2) : '[]'
      }
    }
  },
  { immediate: true },
)
</script>
