<template>
  <UButton
    color="primary"
    size="md"
    class="w-full flex items-center justify-center"
    type="submit"
    :disabled="isDisabled"
  >
    <slot />
  </UButton>
</template>

<script setup lang="ts">
import { useIsFormDirty, useIsFormValid } from 'vee-validate'

const isDirty = useIsFormDirty()
const isValid = useIsFormValid()

const isDisabled = computed(() => {
  return !isDirty.value || !isValid.value
})
</script>
