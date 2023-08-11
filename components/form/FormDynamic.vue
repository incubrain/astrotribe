<template>
  <form
    v-if="fields.length > 1"
    class="flex flex-wrap gap-6"
    @submit="onSubmit"
  >
    <div
      v-for="(field, index) in fields"
      :key="index"
      class="w-full"
    >
      <label
        v-if="hasLabels"
        :for="field.name"
        class="block text-sm font-semibold mb-1"
      >
        {{ field.label }}
      </label>
      <textarea
        v-if="field.type === 'textarea'"
        v-model="field.value"
        :placeholder="field.initialValue"
        :name="field.name"
        class="w-full h-32 px-4 py-2 leading-6 border rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
      ></textarea>
      <input
        v-else
        v-model="field.value"
        :type="field.type"
        :placeholder="field.initialValue"
        :disabled="field.disabled"
        :name="field.name"
        class="w-full h-10 px-4 py-2 leading-6 border rounded shadow-sm placeholder-gray-400 focus:outline-none focus:ring-gray-500 focus:border-gray-500"
      />
      <span
        v-if="field.errorMessage !== undefined"
        class="block mt-1 text-xs text-error-500"
      >
        {{ field.errorMessage }}
      </span>
    </div>
    <UButton
      class="mt-4"
      type="submit"
      block
      :disabled="hasErrors"
    >
      {{ p.buttonLabel }}
    </UButton>
  </form>
</template>

<script setup lang="ts">
import { ComputedRef } from 'vue'
import { useForm, useField } from 'vee-validate'
import { FormField } from 'types/forms'

const p = defineProps({
  schema: {
    type: Array as PropType<FormField[]>,
    required: true
  },
  validationSchema: {
    type: Object,
    required: true
  },
  placeholder: {
    type: Object,
    required: false,
    default: () => ({})
  },
  hasLabels: {
    type: Boolean,
    default: false
  },
  buttonLabel: {
    type: String,
    default: 'Submit'
  }
})

const { handleSubmit, errors } = useForm({
  initialValues: computed(() => p.placeholder),
  validationSchema: p.validationSchema
})

interface Field {
  value: Ref<unknown>
  errorMessage: Ref<unknown>
  errors: any
  width: 'half' | 'full'
  name: string
  label: string
  type: string
  disabled: boolean
  initialValue: ComputedRef
}

const fields = ref([] as Field[])
// Loop through schema and create fields
if (p.schema.length === 0) {
  throw createError('FormDynamic: schema is empty')
}

p.schema.forEach((item: FormField) => {
  const { value, errorMessage, errors } = useField(item.name)
  fields.value.push({
    value,
    errorMessage,
    errors,
    width: item.width,
    name: item.name,
    label: item.props.label,
    type: item.props.type,
    disabled: item.props.disabled ?? false,
    initialValue: computed(() => p.placeholder[item.name])
  })
})

const toast = useToast()
const onSubmit = handleSubmit((values) => {
  toast.add({ title: 'Success', description: 'Your information has been updated', timeout: 5000 })
  emit('submitForm', { ...values })
})

const hasErrors = computed(() => {
  return Object.keys(errors.value).length > 0
})

const emit = defineEmits(['submitForm'])
</script>
