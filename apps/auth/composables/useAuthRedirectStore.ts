// stores/auth-redirect.ts
import { defineStore } from 'pinia'

export const useAuthRedirectStore = defineStore('authRedirect', {
  state: () => ({
    showRedirectModal: false,
  }),
})
