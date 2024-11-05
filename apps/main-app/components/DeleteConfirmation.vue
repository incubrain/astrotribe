    <script setup lang="ts">
const props = defineProps<{
  show: boolean
  itemName?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
}>()
</script>

<template>
  <PrimeDialog
    v-model:visible="show"
    modal
    header="Confirm Delete"
    :style="{ width: '90vw', maxWidth: '400px' }"
  >
    <p>Are you sure you want to delete {{ itemName || 'this item' }}?</p>
    <template #footer>
      <PrimeButton
        label="Cancel"
        class="p-button-text"
        @click="$emit('cancel')"
      />
      <PrimeButton
        label="Delete"
        class="p-button-danger"
        @click="$emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>
