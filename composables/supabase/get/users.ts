import publicClient from '../publicClient'
import type { UserRoles } from '@/types/types'


const client = publicClient()

const userRole = (userRoles: UserRoles) => {
    const roles = userRoles.flatMap((role) => role.title)
    console.log('rolezzzz', userRoles)

    if (roles.includes('admin')) {
        return { icon:  'eos-icons:admin-outlined', role:'Admin' }
    }
    if (roles.includes('mentor')) {
        return { icon:  'fa6-solid:user-graduate', role:'Mentor' }
    }
    if (roles.includes('guide')) {
        return { icon:  'octicon:telescope', role:'Guide' }
    }
    if (roles.includes('user')) {
        return { icon:  '', role:'User' }
    }
}

function formatManyUsers(users) {
    return users.map((user) => {
        const avatar = user.avatar ? `${user.id}/avatar/${user.avatar}` : 'default/avatar/astronaut-avatar.png'
        const roles = user.user_roles.length > 0 ? user.user_roles : [{ id: 3, title: 'mentor'}]
        const mainRole = userRole(roles)
        return {
            ...user,
            avatar,
            user_roles: roles,
            main_role: mainRole,
        }
    })
}

function formatSingleUser(user) {
    return user.map(u => {
        console.log('format user', u)
        const avatar = u.avatar ? `${u.id}/avatar/${u.avatar}` : 'default/avatar/astronaut-avatar.png'
        const coverImg = u.cover_image ? `${u.id}/cover/${u.cover_image}` : 'default/cover/astronaut-cover.jpg'
        const roles = u.user_roles.length > 0 ? u.user_roles : [{ id: 3, title: 'user'}]
        const mainRole = userRole(roles)
        return {
            ...u,
            user_roles: roles,
            main_role: mainRole,
            avatar,
            cover_image: coverImg,
        }
    })
}

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

export const userFollowers = async ({ userId }: { userId: number }) => {
    console.log('followerFollowed', userId)
    const { data, error } = await client
        .from('user_followers')
        .select(`users!user_followers_follower_id_fkey(
            id,
            given_name,
            surname,
            username,
            avatar,
            last_seen,
            introduction,
            follow_count,
            followed_count,
            user_roles(
                roles(id, title)
            )
        )`)
        .eq('followed_id', userId)
    const flatUser = data?.flatMap((item) => item.users) || []
    const users = formatManyUsers(flatUser)
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
        .select(`
            users!user_followers_followed_id_fkey(
                id,
                given_name,
                surname,
                username,
                avatar,
                last_seen,
                introduction,
                follow_count,
                followed_count,
                user_roles(
                    roles(id, title)
                )
            )`
        )
        .eq('follower_id', userId)
    const flatUser = data?.flatMap((item) => item.users) || []
    const users = formatManyUsers(flatUser)
    console.log('followed2222', users)
    return {
        data: users,
        error,
    }
}

export const userSingle = async ({ userId }: { userId: number }) => {
    console.log('userSingle1', userId)
    const { data, error } = await client.rpc('user_single_full', { userid: userId })

    console.log('userSingle2', data, error)
    const user = formatSingleUser(data)

    console.log('userSingle3', user)

    return {
        data: user,
        error,
    }
}

export const UsersMany = async ({ userId }: { userId: number }) => {
    const { data, error } = await client.rpc('users_is_following', { userid: userId })
    console.log('UsersMany', data, error)
    const users = await formatManyUsers(data)
    console.log('UsersMany2', users, error)

    return {
        data: users,
        error,
    }
}
