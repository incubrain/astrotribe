import publicClient from '../publicClient'

const client = publicClient()

const publicBucket = 'public-media'
const privateBucket = 'private-media'


const userFolder = async (userId: string, isPublic: boolean) => {
    const folder = isPublic ? publicBucket : privateBucket

    const { data, error } = await client.storage
        .from('avatars')
        .list(`${folder}/${userId}/`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })

    return {
        data,
        error,
    }
}
const userAvatar = async (userId: string, isPublic: boolean) => {
    const folder = isPublic ? publicBucket : privateBucket

    const { data, error } = await client.storage
        .from('avatars')
        .list(`${folder}/${userId}/`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' },
        })

    return {
        data,
        error,
    }
}

export default {
    userFolder,
    userAvatar,
}
