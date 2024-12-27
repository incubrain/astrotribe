<!-- components/admin/table/form/field/JsonField.vue -->
<template>
  <div class="flex flex-col gap-2">
    <PrimeTextarea
      v-model="jsonString"
      :class="['w-full font-mono text-sm', { 'p-invalid': error || jsonError }]"
      :placeholder="placeholder"
      :autoResize="true"
      rows="8"
      @update:modelValue="validateAndUpdate"
    />
    <span
      v-if="jsonError"
      class="text-sm text-destructive"
    >
      Invalid JSON format
    </span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: any
  field: any
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: any]
}>()

const jsonString = ref('')
const jsonError = ref(false)

const validateAndUpdate = (value: string) => {
  try {
    const parsed = value ? JSON.parse(value) : null
    jsonError.value = false
    emit('update:modelValue', parsed)
  } catch (e) {
    jsonError.value = true
  }
}

const placeholder = computed(() => 'Enter valid JSON')

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue !== undefined) {
      jsonString.value = newValue ? JSON.stringify(newValue, null, 2) : ''
    }
  },
  { immediate: true },
)
</script>
