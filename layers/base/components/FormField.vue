<script setup lang="ts">
defineProps({
  label: {
    type: String,
    required: true,
  },
  required: {
    type: Boolean,
    default: false,
  },
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  fullWidth: {
    type: Boolean,
    default: false,
  },
  initialValue: {
    type: [String, Number, Boolean, Array, Object, Date],
    default: null,
  },
  resolver: {
    type: Function,
    default: undefined,
  },
})
</script>

<template>
  <PrimeFormField
    v-slot="$field"
    :name="name"
    :initial-value="initialValue"
    :resolver="resolver"
  >
    <div
      :class="{ 'md:col-span-2': fullWidth }"
      class="flex flex-col gap-1"
    >
      <label
        :for="id"
        class="block mb-2"
      >
        {{ label }}
        <span
          v-if="required"
          class="text-primary-400"
          >*</span
        >
      </label>

      <slot :field="$field"></slot>

      <PrimeMessage
        v-if="$field?.invalid"
        severity="error"
        size="small"
        variant="simple"
      >
        {{ $field.error?.message }}
      </PrimeMessage>
    </div>
  </PrimeFormField>
</template>
