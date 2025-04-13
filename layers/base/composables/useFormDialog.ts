// composables/useFormDialog.ts
import { ref } from 'vue'

export function useFormDialog() {
  const isDialogVisible = ref(false)
  const isSubmitting = ref(false)
  const submitSuccess = ref(false)
  const submitError = ref(false)
  const successMessage = ref('')
  const errorMessage = ref('')

  const openDialog = () => {
    isDialogVisible.value = true
    // Reset state when opening
    submitSuccess.value = false
    submitError.value = false
    successMessage.value = ''
    errorMessage.value = ''
    isSubmitting.value = false
  }

  const closeDialog = () => {
    isDialogVisible.value = false
  }

  const setSuccess = (message: string) => {
    submitSuccess.value = true
    successMessage.value = message
    submitError.value = false
    errorMessage.value = ''
  }

  const setError = (message: string) => {
    submitError.value = true
    errorMessage.value = message
    submitSuccess.value = false
    successMessage.value = ''
  }

  const startSubmitting = () => {
    isSubmitting.value = true
  }

  const stopSubmitting = () => {
    isSubmitting.value = false
  }

  return {
    isDialogVisible,
    isSubmitting,
    submitSuccess,
    submitError,
    successMessage,
    errorMessage,
    openDialog,
    closeDialog,
    setSuccess,
    setError,
    startSubmitting,
    stopSubmitting,
  }
}
