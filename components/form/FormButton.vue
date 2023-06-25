<template>
  <UButton
    color="primary"
    size="md"
    class="flex items-center justify-center w-full"
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
