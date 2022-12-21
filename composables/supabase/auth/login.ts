import useClient from '../../useClient'


const loginWithEmail = async (email: string, password: string) => {
    const { client } = useClient()
    console.log('login', client.public, email, password)
    const { data, error } = await client.public.auth.signInWithPassword({
        email,
        password,
    })

    return {
        data,
        error,
    }
}

export {
    loginWithEmail,
}
