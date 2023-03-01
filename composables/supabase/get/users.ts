import publicClient from '../publicClient'

const client = publicClient()

export const userById = async (userId: string) => {
    const { data, error } = await client
        .from('users')
        .select('*')
        .eq('id', userId)
    return {
        data,
        error,
    }
}

export const userFollowers = async ({ userId }) => {
    console.log('followerFollowed', userId)
    const { data, error } = await client
        .from('user_followers')
        .select('users!user_followers_follower_id_fkey(*)')
        .eq('followed_id', userId)
    const users = data?.flatMap(item => item.users) || [];
    console.log('followerFollowed2222', users)
    return {
        data: users,
        error,
    }
}

export const userFollowed = async ({ userId }: { userId: number }) => {
    console.log('followerFollowed1111')
    const { data, error } = await client
        .from('user_followers')
        .select('users!user_followers_followed_id_fkey(*)')
        .eq('follower_id', userId)
    const users = data?.flatMap(item => item.users) || [];
    console.log('followed2222', users)
    return {
        data: users,
        error,
    }
}

export const userSingle = async ({ userId }: { userId: number }) => {
    console.log('userSingle1', userId)
    const {
        data,
        error,
    } = await client
        .from('users')
        .select(`
            *,
            user_roles(
                roles(*)
            )`
        ).eq('id', userId)
        
        const user = data?.map(item => {
            const roles = item.user_roles?.flatMap(r => r?.roles) || [null]
            return {
                ...item,
                user_roles: roles,
            }
        })
        
    console.log('userSingle3', user)

    return {
        data: user,
        error,
    }
}

export const UsersMany = async () => {
    
    const { data, error } = await client.from('users')
        .select(`
            id,
            given_name,
            surname,
            username,
            featured_image,
            last_seen,
            user_roles(
                roles(id, title)
            )`
        )
    const users = data?.map(item => {
        const roles = item.user_roles?.flatMap(r => r?.roles) || [null]
        console.log('UsersMany1', roles)
        return {
            ...item,
            user_roles: roles,
        }
    })
        
    console.log('UsersMany2', users, error)

    return {
        data: users,
        error,
    }
}
