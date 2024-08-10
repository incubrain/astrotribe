import { useSelectData } from '../base/select.base.composable'

const DOMAIN_KEY = 'currentUser'

export const useCurrentUser = defineStore(DOMAIN_KEY, () => {
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
    const response = await fetch('/api/auth/logout')
    console.log('removeSession', response)
    profile.value = null
  }

  const profile = ref(null)
  async function loadSession() {
    logger.info('loadSession')
    if (loading.isLoading(DOMAIN_KEY) || profile.value) {
      return
    }

    if (!!profile.value) {
      logger.info('loadSession: Returning cached user')
      return
    }

    loading.setLoading(DOMAIN_KEY, true)

    const response = await fetch('/api/auth/session', {
      method: 'GET'
    })

    const data = errors.server({
      response,
      devOnly: false,
      devMessage: 'error fetching user session',
      userMessage: 'something went wrong when getting your session'
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
      if (newData.hasOwnProperty(key) && hasValueChanged(newData[key], previousData[key])) {
        updatedData[key] = newData[key]
      }
    }

    return { data: updatedData, noDataUpdated: Object.keys(updatedData).length === 0 }
  }

  async function updateProfile(newData: any) {
    const updatedData: any = {}

    // Compare newData with fullProfile and only include changed values
    const { noDataUpdated, data } = cleanDataForUpdate(newData, profile.value)

    if (noDataUpdated) {
      console.log('No changes detected, no update necessary')
      return
    }

    const response = await fetch(`/api/users/update/${userId.value}`, {
      method: 'POST',
      body: data
    })

    const validData = errors.server({
      response,
      devOnly: false,
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
        userId: userId.value
      }
    })

    console.log('fileName', response)

    const fileName = errors.server({
      response,
      devOnly: false,
      devMessage: `Error uploading ${fileType} image`,
      userMessage: `There was an error uploading your ${fileType}`
    })

    let newData = {}

    console.log('fileName', fileName)

    if (fileType === 'avatar') {
      newData = {
        avatar: fileName
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
      () => profile.value?.user_role === 'admin' || profile.value?.user_role === 'super_admin'
    ),
    registeredWithProvider: computed(() => profile.value?.provider),
    profile,
    loadSession,
    removeSession,
    uploadImage,
    updateProfile
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCurrentUser, import.meta.hot))
}
