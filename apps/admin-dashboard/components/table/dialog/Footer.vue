<!-- components/admin/table/dialog/DialogFooter.vue -->
<template>
  <div class="flex justify-end gap-2">
    <PrimeButton
      label="Cancel"
      icon="pi pi-times"
      :disabled="loading"
      class="p-button-text"
      @click="$emit('cancel')"
    />
    <PrimeButton
      label="Save"
      icon="pi pi-check"
      :loading="loading"
      :disabled="disabled"
      @click="$emit('submit')"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  loading?: boolean
  disabled?: boolean
}>()

defineEmits<{
  cancel: []
  submit: []
}>()
</script>
