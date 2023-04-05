import * as t from '../types'

type AppState = {
  posts: t.User[]
  news: t.User[]
  users: t.User[]
  user: t.UserFull
  followers: t.Follower[]
  followed: t.Follower[]
  venues: t.Venue[]
  venue: t.Venue
  events: t.ATEvent[]
  event: t.ATEvent
}

export const appState = defineStore('app', {
  state: (): AppState => ({
    posts: [] as t.User[],
    news: [] as t.User[],
    users: [] as t.User[],
    user: {} as t.UserFull,
    followers: [] as t.Follower[],
    followed: [] as t.Follower[],
    venues: [] as t.Venue[],
    venue: {} as t.Venue,
    events: [] as t.ATEvent[],
    event: {} as t.ATEvent
  })
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(appState, import.meta.hot))
}
