import { useLogger } from '@ib/client'

const DOMAIN_KEY = 'currentUser'

export const useCurrentUser = defineStore(DOMAIN_KEY, () => {
  const authUrl = useRuntimeConfig().public.aeAuthUrl
  const logger = useLogger(DOMAIN_KEY)
  const errors = useBaseError()
  const loading = useLoadingStore()
  const { fetch } = useBaseFetch()
  const userId = useCookie('userId')

  // check:critical - user should only be able to fetch their own full profile
  // check:critical - user should only be able to update their own profile
  // todo:high - allow user to update their profile info
  // todo:med - merge currentUser and profile into one, store all required data everything in their session
  // assign Posthog identify

  async function removeSession() {
    const response = await fetch(`${authUrl}/logout`)
    console.log('removeSession', response)
    profile.value = null
  }

  const profile = ref(null)
  async function loadSession() {
    logger.info('loadSession')
    if (loading.isLoading(DOMAIN_KEY) || profile.value) {
      return
    }

    if (profile.value) {
      logger.info('loadSession: Returning cached user')
      return
    }

    loading.setLoading(DOMAIN_KEY, true)

    const response = await fetch(`${authUrl}/session`, {
      method: 'GET',
    })

    const data = errors.server({
      response,
      devOnly: false,
      devMessage: 'error fetching user session',
      userMessage: 'something went wrong when getting your session',
    })

    if (data) {
      logger.info(`SETTING USER_ID' ${data.user_id}`)
      profile.value = data
      userId.value = data.user_id
      // console.log('sendingIdentify', analytics)
      // analytics?.identify(
      //   data.user_id
      // )
    } else {
      logger.info('no session found')
    }
    loading.setLoading(DOMAIN_KEY, false)
  }

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
        if (
          Object.hasOwnProperty.call(validData[0], key) &&
          profile.value[key] !== validData[0][key]
        ) {
          logger.debug(`Updating profile field: ${key}`, {
            oldValue: profile.value[key],
            newValue: validData[0][key],
          })
          profile.value[key] = validData[0][key]
        }
      }
      logger.info('Profile update completed successfully')
    } catch (error) {
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
      } catch (error) {
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
    loadSession,
    removeSession,
    uploadImage,
    updateProfile,
    testUpdateProfile,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentUser, import.meta.hot))
}
