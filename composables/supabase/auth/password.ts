import useClient from '../../useClient'

const url = 'http://localhost:3000/'

const showResetForm = reactive(false)

const requestResetEmail = async (email: string) => {
    const { client } = useClient()
    const { data, error } = await client.public.auth.resetPasswordForEmail(email, {
        redirectTo: `${url}reset-password`,
    })
    
    return {
        data,
        error,
    }
}

const update = async (newPassword: string) => {
    const { client } = useClient()
    const { data, error } = await client.public.auth.updateUser({
        password: newPassword,
    })

    return {
        data,
        error,
    }
}

export { showResetForm, requestResetEmail, update }
