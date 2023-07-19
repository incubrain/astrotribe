// import * as util from './utilities'

export const useUsersStore = defineStore('users', () => {
  const users = ref([])

  async function checkWeHaveUsers() {
    console.log('checkWeHaveUsers', users.value.length)
    if (users.value.length) return
    console.log('checkWeHaveUsers2', users.value.length)
    // check appState
    const { error, data } = await useFetch('/api/users/many')
    if (error.value) throw createError(`error getting users: ${error.value.message}`)
    if (data.value?.users) users.value = data.value.users // todo check data validity
  }

  const userById = () => {
    return (id: number) => users.value.find((user) => user.id === id)
  }

  return {
    users,
    userById,
    checkWeHaveUsers
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
