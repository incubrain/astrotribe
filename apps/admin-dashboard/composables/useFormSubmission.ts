// composables/useFormSubmission.ts
import { useToast } from 'primevue/usetoast'
import type { Ref } from 'vue'

export function useFormSubmission(
  tableName: string,
  formData: Ref<Record<string, any>>,
  validate: () => boolean,
) {
  const store = useAdminTablesStore()
  const toast = useToast()
  const logger = useLogger('admin')

  const handleSubmit = async () => {
    if (!validate()) {
      toast.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: 'Please check the form for errors',
      })
      logger.warn('Form validation failed', {
        tableName,
        fields: Object.keys(formData.value),
      })
      return null
    }

    try {
      logger.info('Submitting form data', {
        tableName,
        fields: Object.keys(formData.value),
      })

      const result = await store.insertRecord(tableName, formData.value)

      toast.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Row added successfully',
      })

      logger.info('Row added successfully', {
        tableName,
        recordId: result.id,
      })

      return result
    } catch (error: any) {
      logger.error('Error adding row:', {
        tableName,
        error,
        formData: formData.value,
      })

      toast.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to add row',
      })

      return null
    }
  }

  return {
    handleSubmit,
  }
}
