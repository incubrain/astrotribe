import useData from '../composables/useData'
import * as util from './utilities'
import { appState } from './appState'

export const useUsersStore = defineStore('users', () => {
  const globalState = appState()

  async function getUsers() {
    const dataType = 'users'
    // check appState
    if (globalState[dataType].length) return globalState[dataType]
    console.log('userzz2')
    // check localStorage
    globalState[dataType] = util.checkLocalStorage({ dataType })
    if (globalState[dataType].length) return globalState[dataType]
    console.log('userzz3')
    // if not stored get them from database
    const { data, error } = await useData().users.many({ userId: 1 })
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = util.checkDataValidity({
      data,
      dataType,
      schema: 'User'
    })
    console.log('userzz5', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  // async function getAvatar({
  //     userId,
  //     type,
  //     fileName,
  // }: {
  //     userId: number
  //     type: string
  //     fileName: string
  // }) {
  //     console.log('testing', type, userId, fileName)
  //     // if not stored get them from database
  //     const { data } = await useData().images.avatar({
  //         userId,
  //         type,
  //         fileName,
  //     })
  //     if (error) throw createError(error)
  //     // validate data, then store in localStorage
  //     globalState[dataType] = await util.checkDataValidity({
  //         data,
  //         dataType,
  //         schema: 'User',
  //     })
  //     console.log('userzz5', globalState[dataType])
  //     if (!globalState[dataType])
  //         throw createError(`Error validating ${dataType} data`)
  // }

  async function getSingleUser({ userId }: { userId: number }) {
    console.log('testing', globalState.user)
    const dataType = 'user'
    // check appState
    if (globalState[dataType].id === userId) return globalState[dataType]
    console.log('userzz2')
    // check localStorage
    // globalState[dataType] = util.checkLocalStorage({ dataType })
    // if (globalState[dataType]) return globalState[dataType]
    console.log('userzz3')
    // if not stored get them from database
    const { data, error } = await useData().users.single({ userId })
    console.log('userzz4', data, error)
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = util.checkDataValidity({
      data,
      dataType,
      schema: 'UserFull'
    })
    console.log('userzz5', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  async function getFollowCount({ userId }: { userId: number }) {
    console.log('testing', globalState.user)
    const dataType = 'user'
    // check appState
    if (globalState[dataType].id === userId) return globalState[dataType]
    console.log('userzz2')
    // check localStorage
    // globalState[dataType] = util.checkLocalStorage({ dataType })
    // if (globalState[dataType]) return globalState[dataType]
    console.log('userzz3')
    // if not stored get them from database
    const { data, error } = await useData().users.followerCount({ userId })
    console.log('userzz4', data, error)
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = util.checkDataValidity({
      data,
      dataType,
      schema: 'UserFull'
    })
    console.log('userzz5', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  async function getUserFollowers({ userId }: { userId: number }) {
    const dataType = 'followers'
    console.log('followersFollowed1', dataType, userId)
    // check state
    if (globalState[dataType].length) return globalState[dataType]
    // check localStorage
    globalState[dataType] = util.checkLocalStorage({ dataType })
    if (globalState[dataType].length) return globalState[dataType]
    // if not stored get them from database
    const { data, error } = await useData().users.followers({ userId })
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = await util.checkDataValidity({
      data,
      dataType,
      schema: 'User'
    })
    console.log('userzz', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  async function getUserFollowed({ userId }: { userId: number }) {
    const dataType = 'followed'
    console.log('followersFollowed1', dataType, userId)
    // check state
    if (globalState[dataType].length) return globalState[dataType]
    // check localStorage
    globalState[dataType] = util.checkLocalStorage({ dataType })
    if (globalState[dataType].length) return globalState[dataType]
    // if not stored get them from database
    const { data, error } = await useData().users.followed({ userId })
    if (error) throw createError(error)
    // validate data, then store in localStorage
    globalState[dataType] = await util.checkDataValidity({
      data,
      dataType,
      schema: 'User'
    })
    console.log('userzz', globalState[dataType])
    if (!globalState[dataType]) throw createError(`Error validating ${dataType} data`)
  }

  const userById = () => {
    return (id: number) => globalState.users.find((user) => user.id === id)
  }

  return {
    getUsers,
    getSingleUser,
    getUserFollowers,
    getUserFollowed,
    userById
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot))
}
