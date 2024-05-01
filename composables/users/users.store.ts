import type { FetchInput } from '../base/fetch.base.composable'

export const useUsersStore = defineStore('usersStore', () => {
  const logger = useLogger('useUsersStore')
  const users = ref([])
  const baseFetch = useBaseFetch()
  const errors = useBaseError()

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
      params: {
        userId
      }
    })

    const user = errors.handleFetchErrors(response, {
      critical: false,
      devMessage: `getUserById error for user profile for ${userId}`,
      userMessage: 'There was an error fetching the user profile'
    })

    userCurrent.value = user ?? null
  }

  const userById = () => {
    return (id: string) => users.value.find((user) => user.id === id)
  }

  return {
    users,
    userCurrent,
    loadUsers,
    userById,
    getUserById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
