import publicClient from '../publicClient'

const client = publicClient()

export const venueById = async (venueId: string) => {
    const { data, error } = await client.from('users').select('*').eq('id', 4)
    console.log('venueById', data, error)
    return {
        data,
        error,
    }
}

export const venuesMany = async () => {
    const { data, error } = await client.from('venues').select('*')
    console.log('venuesMany', data, error)

    return {
        data,
        error,
    }
}
