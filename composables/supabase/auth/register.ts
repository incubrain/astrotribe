import useClient from '../../useClient'


const registerWithEmail = async (email: string, password: string) => {
    const { client } = useClient()
    const { data, error } = await client.public.auth.signUp({ email, password })

    return {
        data,
        error,
    }
}

export {
    registerWithEmail,
}
