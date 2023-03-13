import publicClient from '../publicClient'

const getCurrent = async () => {
    const client = publicClient()
    const {
        data: { session },
        error,
    } = await client.auth.getSession()

    return {
        session,
        error,
    }
}

const refresh = async () => {
    const client = publicClient()
    const { data, error } = await client.auth.refreshSession()
    const { session, user } = data

    return {
        data,
        error,
    }
}

export { getCurrent, refresh }
