import publicClient from '../publicClient'

const registerWithEmail = async (email: string, password: string) => {
    const client = publicClient()
    const { data, error } = await client.auth.signUp({ email, password })

    return {
        data,
        error,
    }
}

export { registerWithEmail }
