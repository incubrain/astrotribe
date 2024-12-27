// composables/useFormValidation.ts
export function useFormValidation(columns: any[]) {
  const formData = ref<Record<string, any>>({})
  const errors = ref<Record<string, string>>({})

  const validateField = (field: any, value: any) => {
    const errors: string[] = []

    if (!field.is_nullable && (value === null || value === undefined || value === '')) {
      errors.push('This field is required')
    }

    // Add other validations as needed

    return errors
  }

  const validate = () => {
    const newErrors: Record<string, string> = {}

    columns.forEach((col) => {
      const fieldErrors = validateField(col, formData.value[col.field])
      if (fieldErrors.length) {
        newErrors[col.field] = fieldErrors[0]
      }
    })

    errors.value = newErrors
    return Object.keys(newErrors).length === 0
  }

  return {
    formData,
    errors,
    validate,
  }
}
