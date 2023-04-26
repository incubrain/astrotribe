import * as t from '../types'

type AppState = {
  posts: t.User[]
  news: t.User[]
  users: t.User[]
  user: t.UserFull
  followers: t.Follower[]
  followed: t.Follower[]
  venues: t.VenueFull[]
  venue: t.VenueFull
  events: t.EventFull[]
  event: t.EventFull
}

export const appState = defineStore('app', {
  state: (): AppState => ({
    posts: [] as t.User[],
    news: [] as t.User[],
    users: [] as t.User[],
    user: {} as t.UserFull,
    followers: [] as t.Follower[],
    followed: [] as t.Follower[],
    venues: [] as t.VenueFull[],
    venue: {} as t.VenueFull,
    events: [] as t.EventFull[],
    event: {} as t.EventFull
  })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(appState, import.meta.hot))
}
