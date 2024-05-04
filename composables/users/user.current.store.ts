export const useCurrentUser = defineStore('currentUserStore', () => {
  const domainKey = 'currentUser'
  const logger = useLogger('currentUserStore')
  const loading = useLoadingStore()
  const { fetch } = useBaseFetch()
  const errors = useBaseError()

  // check:critical - user should only be able to fetch their own full profile
  // check:critical - user should only be able to update their own profile
  // todo:high - allow user to update their profile info
  // todo:med - merge currentUser and profile into one, store all required data everything in their session
  // Things we should try to avoid storing in session
  // Date of birth
  // Place of birth
  // Race or ethnicity
  // Religion
  // Employment information
  // School or educational institute attended
  // Medical, financial, and other personal records that are unique or can be linked to specific individuals
  // Direct Identifiers / Contact Methods
  // Socials and IPs
  // Employment & Education history
  // DoB
  const userId = useCookie('userId')
  const profile = ref(null)
  const userSession = ref(null)

  async function removeSession() {
    const response = await fetch('/api/auth/logout')
    console.log('removeSession', response)
  }

  async function loadSession(deleteSession = false) {
    logger.info('loadSession')
    if (loading.isLoading(domainKey) || userSession.value) {
      return
    }

    loading.setLoading(domainKey, true)

    const response = await fetch('/api/auth/session', {
      method: 'GET',
      query: {
        deleteSession
      }
    })

    const data = errors.handleFetchErrors(response, {
      critical: true,
      devMessage: 'error fetching user session',
      userMessage: 'something went wrong when getting your session'
    })

    console.log('sessionEx', data)
    if (data) {
      userSession.value = data
      console.log('SETTING USER_ID', data.user_id)
      userId.value = data.user_id
    } else {
      logger.info('no session found')
    }
    loading.setLoading(domainKey, false)
  }

  async function fetchUserProfile(): Promise<any> {
    logger.info('fetchUserProfile: start', userId.value)
    if (profile.value) {
      logger.info('fetchUserProfile: Returning cached user')
      return
    }

    const response = await fetch('/api/users/select/profile', {
      method: 'GET',
      query: {
        userId: userId.value
      }
    })

    const data = errors.handleFetchErrors(response, {
      critical: false,
      devMessage: 'error fetching user proofile',
      userMessage: 'something went wrong when getting your profile'
    })

    if (data) {
      logger.info('fetchUserProfile: user stored', data)
      profile.value = data
    }
  }

  watch(
    () => userSession.value,
    (newUser, oldUser) => {
      if (newUser && newUser !== oldUser) {
        fetchUserProfile()
      }
    },
    { immediate: true, deep: true }
  )

  async function updateProfile(newData: any) {
    const response = await fetch(`/api/users/update/${userId.value}`, {
      method: 'POST',
      body: newData
    })

    const validData = errors.handleFetchErrors(response, {
      critical: false,
      devMessage: `Error updating user profile`,
      userMessage: `There was an error updating your profile after action`
    })

    // update state
    console.log('updating user', validData)
    for (const key in validData[0]) {
      if (validData.hasOwnProperty(key) && profile.value[key] !== validData[key]) {
        profile.value[key] = validData[key]
      }
    }

    userSession.value = validData

    // might need to force refresh of session
  }

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

    console.log('fileName', response)

    const fileName = errors.handleFetchErrors(response, {
      critical: false,
      devMessage: `Error uploading ${fileType} image`,
      userMessage: `There was an error uploading your ${fileType}`
    })

    let newData = {}

    console.log('fileName', fileName)

    if (fileType === 'avatar') {
      newData = {
        avatar: fileName
      }
    } else if (fileType === 'cover_image') {
      newData = {
        cover_image: fileName
      }
    }

    updateProfile(newData)
  }

  // first check if the user has an avatar in their profile
  // if not, check if the user has an avatar in their identities
  // cycle through identities check identities_data for picture

  return {
    haveUserSession: computed(() => !!userSession.value),
    profile,
    userId,
    loadSession,
    removeSession,
    uploadImage
  }
})
