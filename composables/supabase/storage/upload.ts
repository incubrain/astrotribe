import publicClient from '../publicClient'

const client = publicClient()

const publicBucket = 'public-media'
const privateBucket = 'private-media'

const single = async (file: File, userId: string, isPublic: boolean) => {
    console.log('zzz', file)
    const folder = isPublic ? publicBucket : privateBucket
    const { data, error } = await client.storage
        .from(`${folder}`)
        .upload(`/${userId}/avatar.png`, file, {
            cacheControl: '3600',
            upsert: false,
        })

    return {
        data,
        error,
    }
}

export {
    single,
}
