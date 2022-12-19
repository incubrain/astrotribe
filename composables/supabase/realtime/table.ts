import publicClient from '../publicClient'

const client = publicClient()

const single = () => {
    client
        .channel('public:posts')
        .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'posts' },
            (payload) => console.log('subzzz', payload)
        )
        .subscribe()
    // return {
    //     data,
    //     error,
    // }
}

export default {
    single,
}
