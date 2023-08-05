<template>
  <form
    v-if="fields.length > 1"
    class="flex flex-wrap justify-between w-full gap-2"
    @submit="onSubmit"
  >
    <div
      v-for="(field, index) in fields"
      :key="field.name"
      class="h-full my-2 flex flex-col gap-1"
      :class="field.width === 'half' ? 'w-full lg:w-[calc(50%-10px)]' : 'w-full'"
    >
      <label
        :for="field.name"
        v-if="hasLabels"
        class="block text-xs font-semibold"
      >
        {{ field.label }}
      </label>
      <textarea
        v-if="field.type === 'textarea'"
        v-model="field.value"
        :placeholder="field.initialValue"
        :name="field.name"
        class="w-full h-32 px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800 dark:placeholder-gray-500 background"
      ></textarea>
      <input
        v-else
        v-model="field.value"
        :type="field.type"
        :placeholder="field.initialValue"
        :name="field.name"
        class="w-full h-10 px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800 dark:placeholder-gray-500 background"
      />
      <span
        v-if="field.errorMessage !== undefined"
        class="block px-3 py-1 text-xs italic text-error-400 dark:text-error-800"
      >
        {{ field.errorMessage }}
      </span>
    </div>
    <UButton
      class="mt-4"
      type="submit"
      :disabled="hasErrors"
    >
      {{ p.buttonLabel }}
    </UButton>
  </form>
</template>

<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import type { Ref } from 'vue'

const p = defineProps({
  schema: {
    type: Object,
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
  initialValues: { ...p.placeholder },
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
  initialValue: string | undefined
}

const fields = ref([] as Field[])
// Loop through schema and create fields
p.schema.forEach((item) => {
  const { value, errorMessage, errors } = useField(item.name)
  fields.value.push({
    value,
    errorMessage,
    errors,
    width: item.width,
    name: item.name,
    label: item.props.label,
    type: item.props.type,
    initialValue: p.placeholder[item.name]
  })
})

const toast = useToast()
const onSubmit = handleSubmit((values) => {
  console.log('sending data:', values)
  toast.add({ title: 'Success', description: 'Your information has been updated', timeout: 5000 })
  emit('submitForm', { ...values })
})

const hasErrors = computed(() => {
  return Object.keys(errors.value).length > 0
})

const emit = defineEmits(['submitForm'])
</script>
