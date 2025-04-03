<!-- components/DynamicFormField.vue -->
<template>
  <div class="flex flex-col gap-2">
    <label
      :for="field.column_name"
      class="text-sm font-medium text-foreground"
    >
      {{ field.column_name }}
      <span
        v-if="!field.is_nullable"
        class="text-destructive"
        >*</span
      >
    </label>

    <!-- Foreign Key Field -->
    <template v-if="field.foreign_key_info && Object.keys(field.foreign_key_info).length">
      <PrimeSelect
        v-model="modelValue[field.column_name]"
        :options="foreignKeyOptions"
        option-label="label"
        option-value="value"
        :placeholder="'Select ' + field.column_name"
        :class="{ 'p-invalid': errors[field.column_name] }"
        @change="$emit('update:modelValue', modelValue)"
      />
    </template>

    <!-- Boolean Field -->
    <template v-else-if="field.data_type === 'boolean'">
      <PrimeCheckbox
        v-model="modelValue[field.column_name]"
        :binary="true"
        :class="{ 'p-invalid': errors[field.column_name] }"
        @change="$emit('update:modelValue', modelValue)"
      />
    </template>

    <!-- Date/Time Fields -->
    <template v-else-if="['timestamp', 'date', 'time'].some((t) => field.data_type.includes(t))">
      <PrimeDatePicker
        v-model="modelValue[field.column_name]"
        :show-time="field.data_type.includes('time')"
        :show-icon="true"
        :class="{ 'p-invalid': errors[field.column_name] }"
        @change="$emit('update:modelValue', modelValue)"
      />
    </template>

    <!-- Numeric Fields -->
    <template
      v-else-if="['numeric', 'decimal', 'integer', 'bigint', 'smallint'].includes(field.data_type)"
    >
      <PrimeInputNumber
        v-model="modelValue[field.column_name]"
        :min="getNumericMin(field)"
        :max="getNumericMax(field)"
        :decimals="field.numeric_scale || 0"
        :class="{ 'p-invalid': errors[field.column_name] }"
        @update:model-value="$emit('update:modelValue', modelValue)"
      />
    </template>

    <!-- Text Fields -->
    <template v-else>
      <PrimeInputText
        v-model="modelValue[field.column_name]"
        :maxlength="field.character_maximum_length"
        :class="{ 'p-invalid': errors[field.column_name] }"
        @update:model-value="$emit('update:modelValue', modelValue)"
      />
    </template>

    <!-- Error Message -->
    <small
      v-if="errors[field.column_name]"
      class="text-destructive"
    >
      {{ errors[field.column_name] }}
    </small>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  field: any
  modelValue: Record<string, any>
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const foreignKeyOptions = ref<Array<{ label: string; value: any }>>([])

// Load foreign key options
const loadForeignKeyOptions = async () => {
  if (props.field.foreign_key_info && Object.keys(props.field.foreign_key_info).length) {
    const { data, error } = await useSupabaseClient().from(
      props.field.foreign_key_info.foreign_table,
    ).select(`
          ${props.field.foreign_key_info.foreign_column},
          name
        `)

    if (!error) {
      foreignKeyOptions.value = data.map((item) => ({
        label: item.name || item[props.field.foreign_key_info.foreign_column],
        value: item[props.field.foreign_key_info.foreign_column],
      }))
    }
  }
}

// Helper functions for numeric constraints
const getNumericMin = (field: any) => {
  const checkConstraints = field.constraints.filter(
    (c) => c.constraint_type === 'CHECK' && c.check_clause.includes('>='),
  )
  if (checkConstraints.length) {
    const match = checkConstraints[0].check_clause.match(/>=\s*(-?\d+)/)
    return match ? Number(match[1]) : null
  }
  return null
}

const getNumericMax = (field: any) => {
  const checkConstraints = field.constraints.filter(
    (c) => c.constraint_type === 'CHECK' && c.check_clause.includes('<='),
  )
  if (checkConstraints.length) {
    const match = checkConstraints[0].check_clause.match(/<=\s*(-?\d+)/)
    return match ? Number(match[1]) : null
  }
  return null
}

onMounted(() => {
  loadForeignKeyOptions()
})
</script>
