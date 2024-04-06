import type { UserFullType } from '@/types/users'

export const storeUsers = defineStore('storeUsers', () => {
  const logger = useLogger('storeUsers')
  const users = ref([] as UserFullType[])

  async function checkWeHaveUsers(): Promise<boolean> {
    if (users.value.length) return true

    const { error, data } = await useFetch('/api/user/many', {
      headers: useRequestHeaders(['cookie'])
    })
    if (error.value) throw createError(`error getting users: ${error.value.message}`)
    if (data.value?.users) users.value = data.value.users // todo check data validity

    return true
  }

  const userCurrent = ref({} as UserFullType)
  async function getUserById(userId: string) {
    if (userCurrent.value.id && userCurrent.value.id === userId) {
      return
    }

    const { message, status, user } = await $fetch(`/api/user/${userId}`, {
      method: 'GET',
      headers: useRequestHeaders(['cookie'])
    })

    if (status !== 200) {
      logger.error(`error getting user: ${message}`)
      throw createError(message)
    }

    userCurrent.value = user
  }

  async function checkWeHaveUser(id: string) {
    if (userCurrent.value.id && userCurrent.value.id === id) return true

    const { error, data } = await useFetch(`/api/user/${id}`)
    if (error.value) throw createError(`error getting users: ${error.value.message}`)
    if (data.value?.user) {
      userCurrent.value = data.value.user // todo check data validity
      return true
    }
    return false
  }

  const userById = () => {
    return (id: string) => users.value.find((user) => user.id === id)
  }

  return {
    users,
    userCurrent,
    userById,
    checkWeHaveUsers,
    checkWeHaveUser,
    getUserById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(storeUsers, import.meta.hot))
}
