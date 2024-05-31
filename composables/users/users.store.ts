import { get } from 'http'
import type { FetchInput } from '../base/fetch.base.composable'

export const useUsersStore = defineStore('usersStore', () => {
  const logger = useLogger('useUsersStore')
  const errors = useBaseError()
  const users = ref([])
  const baseFetch = useBaseFetch()

  async function loadUsers(input: FetchInput) {
    logger.log('loadUsers start')
    try {
      const data = await baseFetch.fetchPaginatedData(input)

      if (!data) {
        return
      }

      users.value.push(...data)
    } catch (error) {
      logger.error('Failed to load users:', error)
    }
  }

  const userCurrent = ref({} as UserFullType)
  async function getUserById(userId: string) {
    if (userCurrent.value.id && userCurrent.value.id === userId) {
      return
    }

    const response = await baseFetch.fetch('/api/users/select/profile', {
      method: 'GET',
      query: {
        userId
      }
    })

    const user = errors.server({
      response,
      devOnly: false,
      devMessage: `getUserById error for user profile for ${userId}`,
      userMessage: 'There was an error fetching the user profile'
    })

    userCurrent.value = user ?? null
  }

  const userProfiles = ref([])
  async function getManyUserProfiles() {
    const response = await baseFetch.fetch('/api/users/select/profiles', {
      method: 'GET'
    })

    const users = errors.server({
      response,
      devOnly: true,
      devMessage: `getManyUserProfiles error`,
      userMessage: 'There was an error retrieving user profiles'
    })

    userProfiles.value = users ?? null
  }

  function updateUserProfileState(data: any, newData: any) {
    const index = userProfiles.value.findIndex((user) => user.id === data.id)
    if (index !== -1) {
      userProfiles.value[index] = newData
    }
  }

  const userById = () => {
    return (id: string) => users.value.find((user) => user.id === id)
  }

  return {
    users,
    userProfiles,
    userCurrent,
    loadUsers,
    userById,
    getUserById,
    getManyUserProfiles,
    updateUserProfileState
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
