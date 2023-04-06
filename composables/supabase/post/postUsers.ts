import users from './users'

export async function createManyUsers() {
  const client = usePublicClient()
  const { error } = await client.from('users').insert(users)

  console.log('createManyUsers', error)
}
