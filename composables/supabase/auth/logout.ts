import publicClient from '../publicClient'

const logout = async () => {
    const client = publicClient()
    const { error } = await client.auth.signOut()

    // removes session cookie

    // removes localStorage

    // update state

    return {
        error,
    }
}

export { logout }
