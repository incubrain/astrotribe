export function useCurrentUser() {
  const logger = useLogger('useUser')
  const currentUser = useSupabaseUser()
  // check:critical - user should only be able to fetch their own full profile
  // check:critical - user should only be able to update their own profile
  // todo:high - allow user to update their profile info
  // todo:high - allow user to update their profile/cover pictures
  const userId = computed(() => currentUser.value?.id)
  const profile = ref(null as ProfileFullFormatted | null)

  async function fetchUserProfile(): Promise<any> {
    logger.info('fetchUserProfile: start')
    if (profile.value) {
      logger.info('fetchUserProfile: Returning cached user')
      return
    }

    const { message, status, data } = await $fetch('/api/users/single', {
      method: 'GET',
      headers: useRequestHeaders(['cookie']),
      query: {
        userId: userId.value
      }
    })

    logger.info('fetchUserProfile:', 'message: ', message, 'status: ', status)

    if (data) {
      logger.info('fetchUserProfile: user stored', data)
      profile.value = data
    }
  }

  watch(
    () => currentUser.value,
    (newUser, oldUser) => {
      if (newUser && newUser !== oldUser) {
        fetchUserProfile()
      }
    },
    { immediate: true }
  )

  // first check if the user has an avatar in their profile
  // if not, check if the user has an avatar in their identities
  // cycle through identities check identities_data for picture

  return {
    profile
  }
}
