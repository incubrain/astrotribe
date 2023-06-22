export const interest = async ({
  name,
  email,
  referral,
  interest
}: {
  name: string
  email: string
  referral: string
  interest: string
}) => {
  const client = usePublicClient()
  const { data, error } = await client.from('register_interest').insert({ name, email, referral, interest })
  console.log('insert interested user', data, error)
  return {
    data,
    error
  }
}

export const registerWithEmail = async (email: string, password: string) => {
  const client = usePublicClient()
  const { data, error } = await client.auth.signUp({ email, password })

  return {
    data,
    error
  }
}

// export const bulkRegisterWithEmail = async () => {
//   const rawUsers = await import('@/private-data/users.json')
//   rawUsers.forEach(async (user: any) => {
//     const password = user.given_name + '1234$'
//     const { data, error } = await registerWithEmail(user.email, password)
//     console.log('bulkRegisterWithEmail', data, error, password)
//   })
// }
