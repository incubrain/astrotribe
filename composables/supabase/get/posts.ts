import publicClient from '../publicClient'

const client = publicClient()

export const postsMany = async () => {
    const { data, error } = await client.from('posts').select()

    return {
        data,
        error,
    }
}

export const postById = async (postId: number) => {
    const { data, error } = await client.from('posts').select('*').eq('id', postId)

    return {
        data,
        error,
    }
}

export const postByCategory = async (category: string) => {
    const { data, error } = await client.from('posts').select('*').eq('category_id', category)

    return {
        data,
        error,
    }
}
