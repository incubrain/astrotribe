import { useToast } from 'primevue/usetoast'

interface BaseNotification {
  summary: string
  message: string
}

export function useNotification() {
  const nuxtApp = useNuxtApp()
  const getToast: typeof useToast = () => nuxtApp.vueApp.config.globalProperties.$toast
  const toast = getToast()

  const success = ({ summary, message }: BaseNotification) => {
    toast.add({
      severity: 'success',
      summary: `Success: ${summary}`,
      detail: message,
      life: 5000,
      closable: true,
    })
  }

  const error = ({ summary, message }: BaseNotification) => {
    toast.add({
      severity: 'error',
      summary: `Error: ${summary}`,
      detail: message,
      life: 0,
      closable: true,
    })
  }

  const info = ({ summary, message }: BaseNotification) => {
    toast.add({
      severity: 'info',
      summary: `Info: ${summary}`,
      detail: message,
      life: 5000,
      closable: true,
    })
  }

  const warn = ({ summary, message }: BaseNotification) => {
    toast.add({
      severity: 'warn',
      summary: `Warning: ${summary}`,
      detail: message,
      life: 5000,
      closable: true,
    })
  }

  const feature = ({ summary, message }: BaseNotification) => {
    toast.add({
      severity: 'warn',
      group: 'cta',
      summary: summary,
      detail: message,
      life: 0,
      closable: true,
    })
  }

  return {
    success,
    error,
    info,
    warn,
    feature,
  }
}
