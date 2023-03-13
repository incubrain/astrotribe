import publicClient from '../publicClient'
import users from './users'

const client = publicClient()

export async function createManyUsers() {
  const { error } = await client
    .from('users')
    .insert(users)

    console.log('createManyUsers', error)
}