const DOMAIN_KEY = 'currentUser'

export const useCurrentUser = defineStore(DOMAIN_KEY, () => {
  const authURL = useRuntimeConfig().public.authURL
  const logger = useLogger(DOMAIN_KEY)
  const errors = useBaseError()
  const loading = useLoadingStore()
  const { fetch } = useBaseFetch()
  const userId = useCookie('userId')
  const user = useSupabaseUser()

  // check:critical - user should only be able to fetch their own full profile
  // check:critical - user should only be able to update their own profile
  // todo:high - allow user to update their profile info
  // todo:med - merge currentUser and profile into one, store all required data everything in their session
  // assign Posthog identify

  const profile = computed(() => ({
    id: user.value?.id,
    given_name: user.value?.user_metadata?.given_name,
    email_confirmed_at: user.value?.email_confirmed_at,
    confirmation_sent_at: user.value?.confirmation_sent_at,
    confirmed_at: user.value?.confirmed_at,
    created_at: user.value?.created_at,
    surname: user.value?.user_metadata?.surname,
    last_sign_in_at: user.value?.last_sign_in_at,
    email: user.value?.email,
    providers: user.value?.app_metadata.providers,
    avatar: user.value?.user_metadata.avatar ?? user.value?.user_metadata.avatar_url,
    provider: user.value?.provider,
    user_role: user.value?.app_metadata?.role,
    user_plan: user.value?.app_metadata?.plan,
  }))

  // extract as util func
  function hasValueChanged(newValue: any, currentValue: any): boolean {
    console.log('hasValueChanged', newValue, currentValue)
    if (
      typeof newValue === 'string' ||
      typeof newValue === 'boolean' ||
      typeof newValue === 'number'
    ) {
      return newValue !== currentValue
    } else if (Array.isArray(newValue)) {
      return JSON.stringify(newValue) !== JSON.stringify(currentValue)
    } else if (typeof newValue === 'object' && newValue !== null) {
      return JSON.stringify(newValue) !== JSON.stringify(currentValue)
    } else {
      return newValue !== currentValue
    }
  }

  async function refreshUserStore() {
    logger.info('Starting user store refresh')
    const client = useSupabaseClient()

    try {
      const {
        data: { session },
      } = await client.auth.getSession()

      if (!session?.access_token) {
        logger.info('No authentication session found')
        return
      }

      await client.auth.refreshSession(session)

      // Get fresh user data from Supabase
      const {
        data: { user: freshUser },
        error,
      } = await client.auth.getUser()

      if (error) {
        logger.error('Error refreshing user data', { error })
        throw error
      }

      if (freshUser) {
        user.value = freshUser

        return profile.value
      }
    } catch (error: any) {
      logger.error('Failed to refresh user store', { error })
      const toast = useNotification()
      toast.error({
        summary: 'Refresh Failed',
        message: 'Unable to refresh user data. Please try again.',
      })
      throw error
    }
  }

  function cleanDataForUpdate(newData: any, previousData: any) {
    const updatedData: any = {}
    for (const key in newData) {
      if (
        Object.hasOwnProperty.call(newData, key) &&
        hasValueChanged(newData[key], previousData[key])
      ) {
        updatedData[key] = newData[key]
      }
    }

    return { data: updatedData, noDataUpdated: Object.keys(updatedData).length === 0 }
  }

  async function updateProfile(newData: any, isMock: boolean = false) {
    logger.info('Starting updateProfile function', { newData, isMock })
    const updatedData: any = {}

    logger.debug('Cleaning data for update')
    // Compare newData with fullProfile and only include changed values
    const { noDataUpdated, data } = cleanDataForUpdate(newData, profile.value)

    if (noDataUpdated) {
      logger.info('No changes detected, no update necessary')
      return
    }

    logger.debug('Changes detected', { changedData: data })

    try {
      logger.info('Sending update request to server')
      let response
      if (isMock) {
        logger.info('Using mock API call')
        // response = await mockApiCall(data)
      } else {
        response = await $fetch('/api/users/update', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }
      logger.debug('Received response from server', { response })

      const validData = errors.server({
        response,
        devOnly: false,
        devMessage: 'Error updating user profile',
        userMessage: 'There was an error updating your profile after action',
      })

      logger.info('Successfully validated server response', { validData })

      // update state
      logger.debug('Updating user profile state')
      for (const key in validData[0]) {
        if (Object.hasOwnProperty.call(validData[0], key)) {
          logger.debug(`Updating profile field: ${key}`, {
            newValue: validData[0][key],
          })
        }
      }
      logger.info('Profile update completed successfully')
    } catch (error: any) {
      logger.error('Error occurred during profile update', { error })
      throw error // Re-throw the error for the caller to handle
    }
  }

  // Test function
  async function testUpdateProfile() {
    const testCases = [
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Doe', email: 'error@example.com' }, // This will trigger an error
      {}, // This should result in no update
    ]

    for (const testCase of testCases) {
      try {
        console.log('Testing with data:', testCase)
        await updateProfile(testCase, true) // Use mock API
        console.log('Test passed successfully')
      } catch (error: any) {
        console.error('Test failed:', error.message)
      }
      console.log('---')
    }
  }

  type FileType = 'avatar'
  async function uploadImage(fileType: FileType, blob: Blob) {
    // currentFileName is the current file name in the database eg. avatar-drew-macgibbon.jpg
    const formData = new FormData()
    formData.append('file', blob)

    const response = await $fetch('/api/users/insert/image', {
      method: 'POST',
      body: formData,
      params: {
        fileType,
        userId: userId.value,
      },
    })

    console.log('fileName', response)

    const fileName = errors.server({
      response,
      devOnly: false,
      devMessage: `Error uploading ${fileType} image`,
      userMessage: `There was an error uploading your ${fileType}`,
    })

    let newData = {}

    console.log('fileName', fileName)

    if (fileType === 'avatar') {
      newData = {
        avatar: fileName,
      }
    }

    updateProfile(newData)
  }

  // first check if the user has an avatar in their profile
  // if not, check if the user has an avatar in their identities
  // cycle through identities check identities_data for picture

  return {
    haveUserSession: computed(() => !!profile.value),
    isAdmin: computed(
      () => profile.value?.user_role === 'admin' || profile.value?.user_role === 'super_admin',
    ),
    registeredWithProvider: computed(() => profile.value?.provider),
    profile,
    refreshUserStore,
    uploadImage,
    updateProfile,
    testUpdateProfile,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentUser, import.meta.hot))
}
