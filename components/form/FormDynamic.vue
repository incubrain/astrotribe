<template>
  <VForm>
    <div
      v-for="field in p.schema"
      :key="field.name"
      class="mb-4"
    >
      <label
        v-if="p.hasLabels"
        :for="field.name"
        class="block mb-2 text-xs font-semibold"
        >{{ field.label }}</label
      >
      <VField
        :id="field.name"
        :as="field.as"
        :name="field.name"
        :rules="(value) => validateFormWithZod(field.name, value)"
        class="w-full px-3 py-2 leading-tight border rounded shadow appearance-none focus:outline-none focus:shadow-outline placeholder:text-sm placeholder:text-gray-300 dark:placeholder-gray-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100"
        :placeholder="field.label"
      />
      <VErrorMessage
        :name="field.name"
        class="block px-3 py-1 text-xs italic text-error-400 dark:text-error-800"
      />
    </div>
    <slot />
  </VForm>
</template>

<script setup lang="ts">
const p = defineProps({
  schema: {
    type: Object,
    required: true
  },
  schemaValidation: {
    type: Object,
    required: true
  },
  hasLabels: {
    type: Boolean,
    default: false
  }
})

const validateFormWithZod = (fieldName: string, value: string) => {
  if (value === undefined) return
  try {
    p.schemaValidation.shape[fieldName].parse(value)
    return true
  } catch (error) {
    return JSON.parse(error)[0].message
  }
}
</script>
