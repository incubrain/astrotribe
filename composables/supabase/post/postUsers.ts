import users from '@/private-data/users.json'

// You can send an array of objects to insert multiple rows.
export async function createManyUsers() {
  const client = usePublicClient()
  const { error } = await client.from('users').insert(users)

  console.log('createManyUsers', error)
}
