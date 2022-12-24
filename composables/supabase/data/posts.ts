import publicClient from '../publicClient'

const client = publicClient()

// const byId = async (postId: string) => {
//     const { data, error } = await client.auth.admin.getPostById(postId)
//     return {
//         data,
//         error,
//     }
// }

const manyPosts= async () => {

    const { data, error } = await client.from('posts').select()

    return {
        data,
        error,
    }
}

export { manyPosts }
