import publicClient from './supabase/publicClient'
import useAuth from './useAuth'

export default function useEventHandler() {
    const router = useRouter()
    const route = useRoute()
    const client = publicClient()

    const { password, showResetForm } = useAuth()

    const authPages = ['/login', '/register']

    return {
        event: {
            auth: client.auth.onAuthStateChange((event, session) => {
                if (event == 'SIGNED_OUT') {
                    console.log('SIGNED_OUT')
                    router.push('/login')
                }
                if (event == 'TOKEN_REFRESHED') console.log('session refreshed') // update user
                if (event == 'SIGNED_IN') {
                    // do nothing
                    console.log('SIGNED_IN', route.path)
                    if (!authPages.includes(route.path)) null
                    else router.push('/')
                    // !todo redirect to previous page if came from internal page requiring login
                }
                if (event == 'USER_UPDATED') {
                    console.log('USER_UPDATED')
                    // !todo update user in state
                }
                if (event == 'PASSWORD_RECOVERY') {
                    console.log('PASSWORD_RECOVERY', showResetForm.value)
                    password.toggleResetForm(!showResetForm.value)
                    console.log('PASSWORD_RECOVERY', showResetForm.value)
                }
            }),
        },
    }
}
