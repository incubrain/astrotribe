<template>
  <form
    class="space-y-4"
    @submit.prevent="validateAndSubmit"
  >
    <div
      v-for="(input, name) in inputs"
      :key="name"
    >
      <label
        :for="name"
        class="block text-sm font-medium text-gray-700"
      >{{ input.label }}</label>
      <InputText
        :id="name"
        v-model="form[name]"
        class="mt-1 block w-full"
        :type="input.type"
      />
      <p
        v-if="formErrors[name]"
        class="mt-1 text-xs text-red-600"
      >
        {{ formErrors[name] }}
      </p>
    </div>
    <Button
      label="Submit"
      class="w-full"
    />
  </form>
</template>

<script setup>
import { InputText, Button } from 'primevue'
import { z } from 'zod'

// todo:high:2 - make this better

const props = defineProps({
  schema: Object,
  formFields: Object
})

const form = reactive(
  props.formFields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue || ''
    return acc
  }, {})
)

const schema = z.object(props.schema)

const formErrors = computed(() => {
  const result = schema.safeParse(form)
  if (!result.success) {
    return result.error.formErrors.reduce((acc, err) => {
      acc[err.path[0]] = err.message
      return acc
    }, {})
  }
  return {}
})

const validateAndSubmit = () => {
  if (!schema.safeParse(form).success) {
    console.log('Validation errors:', formErrors.value)
    return
  }
  console.log('Form is valid:', form)
  // Proceed with form submission logic, e.g., API call
}
</script>
