import { logout } from './supabase/auth/logout'
import { refresh, getCurrent } from './supabase/auth/session'
import { update, requestResetEmail } from './supabase/auth/password'
import { registerWithEmail } from './supabase/auth/register'
import { loginWithEmail } from './supabase/auth/login'

export default function useAuth() {
  const showResetForm = ref(false)

  return {
    login: {
      loginWithEmail
    },
    logout,
    register: {
      registerWithEmail
    },
    password: {
      requestResetEmail,
      update,
      toggleResetForm: (newValue: boolean) => {
        console.log('toggleResetForm')
        showResetForm.value = newValue
      }
    },
    showResetForm: computed(() => showResetForm.value),
    session: {
      refresh,
      getCurrent
    }
  }
}
