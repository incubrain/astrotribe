import publicClient from '../publicClient'

const client = publicClient()

const userSingle = async (event: Event, userId: string, isPublic: boolean) => {
    console.log('zzz', event)
    const avatarFile = event.target?.files[0]
    const folder = isPublic ? publicBucket : privateBucket
    const { data, error } = await client.storage
        .from('avatars')
        .upload(`${folder}/${userId}/avatar.png`, avatarFile, {
            cacheControl: '3600',
            upsert: false,
        })

    return {
        data,
        error,
    }
}

export default {
    userSingle,
}
