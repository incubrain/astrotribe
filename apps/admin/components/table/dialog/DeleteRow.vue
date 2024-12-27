<!-- components/admin/table/dialog/DeleteRow.vue -->
<template>
  <PrimeDialog
    v-model:visible="modelValue"
    modal
    header="Confirm Delete"
    class="background"
  >
    <div class="confirmation-content flex items-center gap-3">
      <i
        class="pi pi-exclamation-triangle text-warning"
        style="font-size: 2rem"
      />
      <span class="">
        Are you sure you want to delete {{ count }} selected record{{ count !== 1 ? 's' : '' }}?
      </span>
    </div>
    <template #footer>
      <TableDialogFooter
        :loading="loading"
        submit-label="Delete"
        submit-icon="pi pi-trash"
        submit-severity="danger"
        @cancel="$emit('update:visible', false)"
        @submit="$emit('confirm')"
      />
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
const props = defineProps<{
  visible: boolean
  count: number
  loading?: boolean
}>()

const modelValue = ref(props.visible)

defineEmits<{
  'update:visible': [value: boolean]
  'confirm': []
}>()
</script>
