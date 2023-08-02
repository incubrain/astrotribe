<template>
  <VForm :validation-schema="validationSchema">
    <div
      v-for="field in schema"
      :key="field.name"
      class="mb-4"
    >
      <label
        v-if="hasLabels"
        :for="field.name"
        class="block mb-2 text-xs font-semibold"
      >{{ field.label }}</label>
      <VField
        :id="field.name"
        :as="field.as"
        :name="field.name"
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

defineProps({
  schema: {
    type: Object,
    required: true
  },
  validationSchema: {
    type: Object,
    required: true
  },
  hasLabels: {
    type: Boolean,
    default: false
  }
})

</script>
