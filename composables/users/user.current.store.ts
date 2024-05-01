export const useCurrentUser = defineStore('currentUserStore', () => {
  const logger = useLogger('currentUserStore')
  const { fetch } = useBaseFetch()

  // check:critical - user should only be able to fetch their own full profile
  // check:critical - user should only be able to update their own profile
  // todo:high - allow user to update their profile info
  // todo:high - allow user to update their profile/cover pictures
  const userId = useCookie('userId')
  const profile = ref(null)
  const currentUser = ref(null)
  const permissions = reactive({
    userRole: null,
    userPlan: null,
    role: null,
    plan: null
  })

  async function loadSession() {
    const { data: userSession } = await fetch('/api/permissions')
    currentUser.value = userSession
    console.log('userSession', userSession)
    userId.value = userSession.user.id

    permissions.plan = userSession.planPermissions
    permissions.role = userSession.rolePermissions
    permissions.userPlan = userSession.userPlan
    permissions.userRole = userSession.userRole
  }

  async function fetchUserProfile(): Promise<any> {
    logger.info('fetchUserProfile: start', userId.value)
    if (profile.value) {
      logger.info('fetchUserProfile: Returning cached user')
      return
    }

    const { message, status, data } = await fetch('/api/users/select/profile', {
      method: 'GET',
      params: {
        userId: userId.value
      }
    })

    console.log('fetchUserProfile:', 'message: ', message, 'status: ', status)

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

  async function uploadImage(fileType: string, blob: Blob) {
    const formData = new FormData()
    formData.append('file', blob)
  
    const response = await $fetch('/api/users/insert/image', {
      method: 'POST',
      body: formData,
      params: {
        fileType,
        userId: userId.value
      }
    })
  
    let dataToUpdate = {}
  
      if (fileType === 'avatar') {
        dataToUpdate = {
          avatar: `${fileName}.${fileExtention}`
        }
      } else if (fileType === 'cover_image') {
        dataToUpdate = {
          cover_image: `${fileName}.${fileExtention}`
        }
      }
      // update account with new avatar
      console.log('attempting to update', dataToUpdate)
      const { error: updateError, data } = await client
        .from('user_profiles')
        .update(dataToUpdate)
        .eq('id', userId)
        .select()
  
      if (updateError) {
        console.error('error', updateError)
        throw createError({ statusMessage: updateError.message })
      }
  
    console.log('response', response)
  }

  // first check if the user has an avatar in their profile
  // if not, check if the user has an avatar in their identities
  // cycle through identities check identities_data for picture

  return {
    isLoggedIn: computed(() => !!currentUser.value),
    permissions,
    profile,
    userId,
    loadSession,
    userFullName: computed(() => `${profile.value?.given_name} ${profile.value?.surname}`)
  }
})
