<!-- components/admin/table/form/DynamicFormField.vue -->
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

    <component
      :is="resolveFieldComponent"
      v-model="localValue[field.column_name]"
      :field="field"
      :error="errors[field.column_name]"
      @update:modelValue="handleUpdate"
    />

    <span
      v-if="errors[field.column_name]"
      class="text-sm text-destructive"
    >
      {{ errors[field.column_name] }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import FieldText from '~/components/table/form/field/FieldText.vue'
import FieldNumber from '~/components/table/form/field/FieldNumber.vue'
import FieldDate from '~/components/table/form/field/FieldDate.vue'
import FieldBoolean from '~/components/table/form/field/FieldBoolean.vue'
import FieldForeignKey from '~/components/table/form/field/FieldForeignKey.vue'
import FieldTextArea from '~/components/table/form/field/FieldTextArea.vue'
import FieldJson from '~/components/table/form/field/FieldJson.vue'
import FieldInterval from '~/components/table/form/field/FieldInterval.vue'
import FieldEnum from '~/components/table/form/field/FieldEnum.vue'
import FieldArray from '~/components/table/form/field/FieldArray.vue'

const props = defineProps<{
  field: any
  modelValue: Record<string, any>
  errors: Record<string, string>
}>()

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const localValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
})

// In DynamicFormField.vue
const resolveFieldComponent = computed(() => {
  if (props.field.foreign_key_info) {
    return FieldForeignKey
  }

  // Check for array type
  if (props.field.data_type.endsWith('[]')) {
    return FieldArray
  }

  // Check for enum type
  if (
    props.field.constraints?.some(
      (c: any) => c.constraint_type === 'CHECK' && c.check_clause.includes('ANY'),
    )
  ) {
    return FieldEnum
  }

  switch (props.field.data_type) {
    case 'boolean':
      return FieldBoolean
    case 'integer':
    case 'numeric':
    case 'decimal':
    case 'bigint':
    case 'smallint':
      return FieldNumber
    case 'timestamp':
    case 'timestamptz':
    case 'date':
      return FieldDate
    case 'json':
    case 'jsonb':
      return FieldJson
    case 'text':
      return props.field.character_maximum_length > 255 ? FieldTextArea : FieldText
    case 'interval':
      return FieldInterval
    default:
      return FieldText
  }
})

const handleUpdate = (value: any) => {
  const newValue = { ...localValue.value }
  newValue[props.field.column_name] = value
  emit('update:modelValue', newValue)
}
</script>
