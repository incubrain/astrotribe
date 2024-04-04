export default function useUser() {
  const user = useSupabaseUser()

  console.log('the user', user.value)

  const profile = computed(() => ({
    id: user.value?.id ?? '',
    givenName: user.value?.user_metadata?.given_name ?? '',
    familyName: user.value?.user_metadata?.family_name ?? '',
    email: user.value?.email ?? '',
    avatar: user.value?.user_metadata?.picture ?? ''
  }))

  return {
    profile
  }
}
