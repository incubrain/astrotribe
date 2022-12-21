import useClient from '../../useClient'


const logout = async () => {
    const { client } = useClient()
    const { error } = await client.public.auth.signOut()

    // removes session cookie

    // removes localStorage

    // update state

    return {
        error,
    }
}


export {
    logout,
}
