import * as t from '../types/types'

type AppState = {
  posts: t.User[],
  news: t.User[],
  users: t.User[],
  user: t.User,
  followers: t.Follower[],
  followed: t.Follower[],
  venues: t.Venue[],
  events: t.Event[],
}

export default defineStore('app', {
  state: (): AppState => ({
      posts: []  as t.User[],
      news: [] as t.User[],
      users: [] as t.User[],
      user: {} as t.User,
      followers: [] as t.Follower[],
      followed: [] as t.Follower[],
      venues: [] as t.Venue[],
      events: [] as t.Event[],
  })
}) as AppState

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePostsStore, import.meta.hot))
}