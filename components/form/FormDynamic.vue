<template>
  <form
    class="flex flex-wrap justify-between w-full gap-2"
    @submit="onSubmit"
  >
    <div
      v-for="(field, index) in fields"
      :key="index"
      class="h-full my-2 flex flex-col gap-1"
      :class="field.width === 'half' ? 'w-full lg:w-[calc(50%-10px)]' : 'w-full'"
    >
      <label
        :for="p.schema[index].name"
        v-if="hasLabels"
        class="block text-xs font-semibold"
      >
        {{ p.schema[index].props.label }}
      </label>
      <input
        v-model="field.value.value"
        :type="p.schema[index].props.type"
        :placeholder="p.placeholder[p.schema[index].name]"
        :name="p.schema[index].name"
        class="w-full h-10 px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-800 dark:placeholder-gray-500 background"
      />
      <span v-if="field.errorMessage.value !== undefined" class="block px-3 py-1 text-xs italic text-error-400 dark:text-error-800">
        {{ field.errorMessage.value }}
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

const { defineInputBinds, handleSubmit, errors, meta } = useForm({
  initialValues: { ...p.placeholder },
  validationSchema: p.validationSchema
})

// Create a field for each item in your schema
const fields = computed(() =>
  p.schema.map((item) => {
    const { value, errorMessage, errors } = useField(item.name)
    console.log('errorMessage', errorMessage)
    return { value, errorMessage, errors, width: item.width }
  })
)

const onSubmit = handleSubmit((values) => {
  console.log('sending data:', values)
  emit('submitForm', { ...values })
})

const getInputBinds = (name: string) => {
  const binds = defineInputBinds(name)
  console.log(`Binds for ${name}:`, binds)
  return binds
}

const hasErrors = computed(() => {
  return Object.keys(errors.value).length > 0
})

const emit = defineEmits(['submitForm'])
</script>
