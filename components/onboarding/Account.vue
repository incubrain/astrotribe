<template>
  <form @submit.prevent="handleSubmit">
    <div class="p-fluid">
    </div>
    <div class="mt-4">
      <PrimeButton
        type="button"
        label="Previous"
        class="p-button-secondary mr-2"
        @click="$emit('prev')"
      />
      <PrimeButton
        type="submit"
        label="Submit"
      />
    </div>
  </form>
</template>

<script setup lang="ts">
const { form, errors, validateAndUpdate, accountDetailsSchema } = useOnboarding()

const handleSubmit = () => {
  if (validateAndUpdate(accountDetailsSchema)) {
    // Submit the form data to your API
    console.log('Form submitted:', form)
  }
}

const emit = defineEmits(['prev'])
</script>
