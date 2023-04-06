const registerWithEmail = async (email: string, password: string) => {
  const client = usePublicClient()
  const { data, error } = await client.auth.signUp({ email, password })

  return {
    data,
    error
  }
}

export { registerWithEmail }
