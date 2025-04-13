<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

// Props definition
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  visible: {
    type: Boolean,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  successMessage: {
    type: String,
    default: '',
  },
  errorMessage: {
    type: String,
    default: '',
  },
  submitButtonText: {
    type: String,
    default: 'Submit',
  },
  width: {
    type: String,
    default: '50rem',
  },
  initialValues: {
    type: Object,
    default: () => ({}),
  },
  resolver: {
    type: Function,
    default: undefined,
  },
})

// Emits definition
const emit = defineEmits(['update:visible', 'submit'])

// Methods
const closeDialog = () => {
  emit('update:visible', false)
}

const handleFormSubmit = (result) => {
  emit('submit', result)
}
</script>

<template>
  <PrimeDialog
    :visible="visible"
    :header="title"
    modal
    :style="{ width, maxWidth: '95vw' }"
    @update:visible="emit('update:visible', $event)"
  >
    <PrimeForm
      :initial-values="initialValues"
      :resolver="resolver"
      class="space-y-6"
      @submit="handleFormSubmit"
    >
      <!-- Form content (slot) -->
      <slot name="content"></slot>

      <!-- Status Messages -->
      <PrimeMessage
        v-if="successMessage"
        severity="success"
        :pt="{ text: 'text-sm' }"
      >
        {{ successMessage }}
      </PrimeMessage>

      <PrimeMessage
        v-if="errorMessage"
        severity="error"
        :pt="{ text: 'text-sm' }"
      >
        {{ errorMessage }}
      </PrimeMessage>

      <!-- Form Actions -->
      <div class="flex justify-center w-full">
        <slot name="actions">
          <PrimeButton
            type="submit"
            :loading="loading"
            class="bg-primary-600 hover:bg-primary-700"
          >
            {{ submitButtonText }}
          </PrimeButton>
        </slot>
      </div>
    </PrimeForm>
  </PrimeDialog>
</template>
