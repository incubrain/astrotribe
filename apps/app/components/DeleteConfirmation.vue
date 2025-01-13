<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  show: boolean
  itemName?: string
}>()

const emit = defineEmits<{
  (e: 'confirm'): void
  (e: 'cancel'): void
  (e: 'update:show', value: boolean): void
}>()

const isVisible = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value),
})
</script>

<template>
  <PrimeDialog
    v-model:visible="isVisible"
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
