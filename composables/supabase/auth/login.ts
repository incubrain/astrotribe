import publicClient from '../publicClient'

const loginWithEmail = async (email: string, password: string) => {
    const client = publicClient()
    console.log('login', client, email, password)
    const { data, error } = await client.auth.signInWithPassword({
        email,
        password,
    })

    return {
        data,
        error,
    }
}

export { loginWithEmail }
