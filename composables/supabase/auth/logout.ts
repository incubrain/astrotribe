import publicClient from '../publicClient'

export const logout = async () => {
    const client = publicClient()
    const { error } = await client.auth.signOut()

    // removes session cookie
    // removes localStorage
    // update state

    return {
        error,
    }
}
