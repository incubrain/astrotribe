import eventHandler from './supabase/eventHandler'
import logout from './supabase/auth/logout'
import session from './supabase/auth/session'
import { showResetForm, update, requestResetEmail, handlePasswordReset } from './supabase/auth/password'
import register from './supabase/auth/register'
import login from './supabase/auth/login'

export default function useAuth() {
    return {
        login,
        logout,
        register,
        password: {
            requestResetEmail,
            update,
            showResetForm: computed(() => showResetForm.value),
        },
        session,
        eventHandler,
        event: {
            handlePasswordReset,
        }
    }
}
