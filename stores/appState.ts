import * as t from '../types'

type AppState = {
  posts: t.UserBasic[]
  news: t.UserBasic[]
  users: t.UserBasic[]
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
    posts: [] as t.UserBasic[],
    news: [] as t.UserBasic[],
    users: [] as t.UserBasic[],
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
