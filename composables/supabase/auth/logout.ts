import publicClient from '../publicClient'

const logout = async () => {
    const client = publicClient()
    const { error } = await client.auth.signOut()

    return {
        error,
    }
}

export default logout
