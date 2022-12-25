import publicClient from '../publicClient'

const client = publicClient()

const manyPosts= async () => {

    const { data, error } = await client.from('posts').select()

    return {
        data,
        error,
    }
}

export { manyPosts }
