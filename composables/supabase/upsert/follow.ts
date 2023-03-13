import publicClient from '../publicClient'

const client = publicClient()

export async function followUser({ userId, followerId }: { userId: number, followerId: number }) {
  const { error } = await client
    .from('user_followers')
    .upsert({ followed_id: userId, follower_id: followerId })
    .select()

    console.log('followUser', error)
}

export async function unfollowUser({ userId, followerId }: { userId: number, followerId: number }) {
  const { error } = await client
    .from('user_followers')
    .upsert({ followed_id: userId, follower_id: followerId })
    .select()

    console.log('followUser', error)
}