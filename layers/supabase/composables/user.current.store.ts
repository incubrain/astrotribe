const DOMAIN_KEY = 'currentUser'

export const useCurrentUser = defineStore(DOMAIN_KEY, () => {
  const authURL = useRuntimeConfig().public.authURL
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

  type Provider =
    | 'linkedin_oidc'
    | 'twitter'
    | 'google'
    | 'facebook'
    | 'github'
    | 'discord'
    | 'email'

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
    avatar: user.value?.user_metadata.avatar || user.value?.user_metadata.avatar_url,
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

  async function refreshUserStore() {
    console.info('Starting user store refresh')
    const client = useSupabaseClient()

    try {
      const {
        data: { session },
      } = await client.auth.getSession()

      if (!session?.access_token) {
        console.info('No authentication session found')
        return
      }

      await client.auth.refreshSession(session)

      // Get fresh user data from Supabase
      const {
        data: { user: freshUser },
        error,
      } = await client.auth.getUser()

      if (error) {
        console.error('Error refreshing user data', { error })
        throw error
      }

      if (freshUser) {
        user.value = freshUser

        return profile.value
      }
    } catch (error: any) {
      console.error('Failed to refresh user store', { error })
      const toast = useNotification()
      toast.error({
        summary: 'Refresh Failed',
        message: 'Unable to refresh user data. Please try again.',
      })
      throw error
    }
  }

  async function updateProfile(newData: any, isMock: boolean = false) {
    console.info('Starting updateProfile function', { newData, isMock })
    const updatedData: any = {}
    const toast = useNotification()

    console.info('Cleaning data for update')
    // Compare newData with fullProfile and only include changed values
    const { noDataUpdated, data } = cleanDataForUpdate(newData, profile.value)

    if (noDataUpdated) {
      console.info('No changes detected, no update necessary')
      return
    }

    console.info('Changes detected', { changedData: data })

    try {
      console.info('Sending update request to server')
      let response
      if (isMock) {
        console.info('Using mock API call')
        // response = await mockApiCall(data)
      } else {
        response = await $fetch('/api/users/update', {
          method: 'POST',
          body: JSON.stringify(data),
        })
      }
      console.info('Received response from server', { response })

      const validData = errors.server({
        response,
        devOnly: false,
        devMessage: 'Error updating user profile',
        userMessage: 'There was an error updating your profile after action',
      })

      if (response.error) {
        toast.error({ summary: 'Could not update profile', message: response.error.message })
        return
      } else {
        toast.success({
          summary: 'Profile updated successfully',
          message: 'Your profile was updated',
        })
      }

      console.info('Successfully validated server response', { validData })

      // update state
      console.info('Updating user profile state')
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          profile.value[key] = data[key]
          console.info(`Updating profile field: ${key}`, {
            newValue: data[key],
          })
        }
      }
      console.info('Profile update completed successfully')
    } catch (error: any) {
      console.error('Error occurred during profile update', { error })
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

  function formatProviderName(provider: Provider) {
    const providers = {
      linkedin_oidc: 'LinkedIn',
      twitter: 'Twitter',
      google: 'Google',
      facebook: 'Facebook',
      github: 'GitHub',
      discord: 'Discord',
      email: 'Email',
    } as const

    return providers[provider] || provider
  }

  function getProviderIcon(provider: Provider) {
    const icons = {
      linkedin_oidc: 'mdi:linkedin',
      twitter: 'mdi:twitter',
      google: 'mdi:google',
      facebook: 'mdi:facebook',
      github: 'mdi:github',
      discord: 'mdi:discord',
      email: 'mdi:email',
    } as const

    return icons[provider] || 'mdi:account'
  }

  function getProviderColor(provider: Provider) {
    const colors = {
      linkedin_oidc: 'rgb(10, 102, 194)',
      twitter: 'rgb(29, 155, 240)',
      google: 'rgb(219, 68, 55)',
      facebook: 'rgb(66, 103, 178)',
      github: 'rgb(36, 41, 47)',
      discord: 'rgb(88, 101, 242)',
      email: 'rgb(234, 88, 12)',
    } as const

    return colors[provider] || '#666'
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
    uploadImage,
    updateProfile,
    refreshUserStore,
    testUpdateProfile,
    getProviderIcon,
    getProviderColor,
    formatProviderName,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentUser, import.meta.hot))
}
