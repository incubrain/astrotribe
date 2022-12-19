import publicClient from '../publicClient'

const url = 'http://localhost:3000/'
const client = publicClient()

const showResetForm = ref(false)

const requestResetEmail = async (email: string) => {
    const { data, error } = await client.auth.resetPasswordForEmail(email, {
        redirectTo: `${url}reset-password`,
    })

    return {
        data,
        error,
    }
}

const handlePasswordReset = client.auth.onAuthStateChange((event) => {
    if (event == 'PASSWORD_RECOVERY') return (showResetForm.value = true)
})

const update = async (newPassword: string) => {
    const { data, error } = await client.auth.updateUser({
        password: newPassword,
    })

    return {
        data,
        error,
    }
}

export { showResetForm, requestResetEmail, update, handlePasswordReset }
