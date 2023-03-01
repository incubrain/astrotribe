import * as t from '../types/types'

export const appState = defineStore('app', {
  state: () => {
    return {
      posts: []  as t.User[],
      news: [] as t.User[], //
      users: [] as t.User[],
      user: {} as t.User,
      followers: [] as t.Follower[],
      followed: [] as t.Follower[],
      venues: [] as t.Venue[],
      events: [] as t.Event[],
    }
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}