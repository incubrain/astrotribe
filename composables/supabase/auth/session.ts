import useClient from '../../useClient'


const getCurrent = async () => {
    const { client } = useClient()
    const { data: { session }, error } = await client.public.auth.getSession()
    
    return {
        session,
        error,
    }
}

const refresh = async () => {
    const { client } = useClient()
    const { data, error } = await client.public.auth.refreshSession()
    const { session, user } = data

    return {
        data,
        error,
    }
}

export {
    getCurrent,
    refresh,
}
