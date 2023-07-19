// import * as util from './utilities'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])
  const userCurrent = ref({})

  async function checkWeHaveUsers() {
    console.log('checkWeHaveUsers', users.value.length)
    if (users.value.length) return
    console.log('checkWeHaveUsers2', users.value.length)
    // check appState
    const { error, data } = await useFetch('/api/users/many')
    if (error.value) throw createError(`error getting users: ${error.value.message}`)
    if (data.value?.users) users.value = data.value.users // todo check data validity
  }

  async function checkWeHaveUser(id: number) {
    console.log('checkWeHaveUser', userCurrent.value, id)
    if (userCurrent.value.id && userCurrent.value.id === id) return true
    console.log('checkWeHaveUser2', userCurrent.value)
    // check appState
    const { error, data } = await useFetch(`/api/users/${id}`)
    console.log('checkWeHaveUser3', data.value.user)
    if (error.value) throw createError(`error getting users: ${error.value.message}`)
    if (data.value?.user) {
      userCurrent.value = data.value.user // todo check data validity
      return true
    }
    return false
  }

  const userById = () => {
    return (id: number) => users.value.find((user) => user.id === id)
  }

  return {
    users,
    userCurrent,
    userById,
    checkWeHaveUsers,
    checkWeHaveUser
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
