export const useContactForm = () => {
  const isSending = ref(false)
  enum CONTACT_TYPE {
    CONSULTATION = 'consultation',
    MESSAGE = 'message',
    ADVERTISMENT = 'advertisement',
  }

  interface Form {
    contact_type: CONTACT_TYPE
    email: string
    message: string
    company?: string
  }

  const sendForm = async (form: Form) => {
    try {
      isSending.value = true
      console.log('SENDING MESSAGE')
      const response = await $fetch(`/api/contact`, {
        method: 'POST',
        body: form,
      })
      console.log('MESSAGE SENT SUCCESSFULLY')
      return response
    } catch (error: any) {
      console.error(`Error sending message with contact form`, error)
    } finally {
      isSending.value = false
    }
  }

  return {
    CONTACT_TYPE,
    isSending,
    sendForm,
  }
}
