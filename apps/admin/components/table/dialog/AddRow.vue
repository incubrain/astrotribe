<!-- components/admin/table/dialog/AddRow.vue -->
<template>
  <PrimeDialog
    modal
    header="Add New Row"
  >
    <form
      class="space-y-4"
      @submit.prevent="handleSubmit"
    >
      <TableFormDynamicField
        v-for="col in columns"
        :key="col.field"
        v-model="formData"
        :field="col"
        :errors="errors"
      />
    </form>
    <template #footer>
      <TableDialogFooter
        :disabled="hasErrors"
        @cancel="onCancel"
        @submit="handleSubmit"
      />
    </template>
  </PrimeDialog>
</template>

<script setup lang="ts">
import { useFormValidation } from '~/composables/useFormValidation'
import { useFormSubmission } from '~/composables/useFormSubmission'

const props = defineProps<{
  columns: any[]
  tableName: string
}>()

// Form handling logic split into composables
const { formData, errors, validate } = useFormValidation(props.columns)
const { handleSubmit } = useFormSubmission(props.tableName, formData, validate)
</script>
