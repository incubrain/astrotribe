<!-- components/admin/table/form/field/ForeignKeyField.vue -->
<template>
  <PrimeSelect
    v-model="localValue"
    :options="options"
    option-label="label"
    option-value="value"
    :placeholder="placeholder"
    :loading="loading"
    :class="['w-full', { 'p-invalid': error }]"
  />
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

const loading = ref(false)
const options = ref<Array<{ label: string; value: any }>>([])

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

const placeholder = computed(() => `Select ${props.field.column_name}`)

const loadOptions = async () => {
  if (!props.field.foreign_key_info) return

  loading.value = true
  try {
    const { data, error } = await useSupabaseClient().from(
      props.field.foreign_key_info.foreign_table,
    ).select(`
          ${props.field.foreign_key_info.foreign_column},
          name
        `)

    if (error) throw error

    options.value = data.map((item) => ({
      label: item.name || item[props.field.foreign_key_info.foreign_column],
      value: item[props.field.foreign_key_info.foreign_column],
    }))
  } catch (error: any) {
    console.error('Error loading foreign key options:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadOptions()
})
</script>
